# Bastion Host Module
# Provides secure SSH access to private resources (RDS, ElastiCache)

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security group for bastion host
resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg-${var.environment}"
  description = "Security group for bastion host"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from allowed IPs"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-bastion-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM role for bastion host
resource "aws_iam_role" "bastion" {
  name = "${var.project_name}-bastion-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-bastion-role-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach SSM policy for Session Manager access (optional SSH alternative)
resource "aws_iam_role_policy_attachment" "bastion_ssm" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance profile for bastion
resource "aws_iam_instance_profile" "bastion" {
  name = "${var.project_name}-bastion-profile-${var.environment}"
  role = aws_iam_role.bastion.name

  tags = {
    Name        = "${var.project_name}-bastion-profile-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Key pair for SSH access
resource "aws_key_pair" "bastion" {
  count = var.ssh_public_key != null ? 1 : 0

  key_name   = "${var.project_name}-bastion-key-${var.environment}"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-bastion-key-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Bastion host EC2 instance
resource "aws_instance" "bastion" {
  ami                         = var.ami_id != null ? var.ami_id : data.aws_ami.amazon_linux_2023.id
  instance_type               = var.instance_type
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  iam_instance_profile        = aws_iam_instance_profile.bastion.name
  key_name                    = var.ssh_public_key != null ? aws_key_pair.bastion[0].key_name : null
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.root_volume_size
    encrypted             = true
    delete_on_termination = true
  }

  # Install PostgreSQL client and Redis CLI for database access
  user_data = base64encode(<<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y postgresql15 redis6

    # Enable SSM agent
    systemctl enable amazon-ssm-agent
    systemctl start amazon-ssm-agent
  EOF
  )

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"  # IMDSv2 required
    http_put_response_hop_limit = 1
  }

  tags = {
    Name        = "${var.project_name}-bastion-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }

  lifecycle {
    ignore_changes = [ami]
  }
}

# Elastic IP for bastion (optional but recommended for stable IP)
resource "aws_eip" "bastion" {
  count = var.create_elastic_ip ? 1 : 0

  instance = aws_instance.bastion.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-bastion-eip-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}
