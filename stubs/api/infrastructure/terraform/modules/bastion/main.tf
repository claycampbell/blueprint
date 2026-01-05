# Bastion Host Module
# Creates a bastion host for secure SSH access to private resources

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
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

# Security Group for Bastion
resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg-${var.environment}"
  description = "Security group for bastion host"
  vpc_id      = var.vpc_id

  # Allow SSH from specified CIDR blocks
  ingress {
    description = "SSH from allowed CIDR blocks"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  # Allow all outbound (for connecting to private resources)
  egress {
    description = "Allow all outbound"
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

# Key Pair (if SSH public key is provided)
resource "aws_key_pair" "bastion" {
  count      = var.ssh_public_key != null ? 1 : 0
  key_name   = "${var.project_name}-bastion-key-${var.environment}"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-bastion-key-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM Role for Bastion (for SSM Session Manager)
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

# Attach SSM policy for Session Manager access
resource "aws_iam_role_policy_attachment" "bastion_ssm" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance Profile
resource "aws_iam_instance_profile" "bastion" {
  name = "${var.project_name}-bastion-profile-${var.environment}"
  role = aws_iam_role.bastion.name

  tags = {
    Name        = "${var.project_name}-bastion-profile-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP (optional)
resource "aws_eip" "bastion" {
  count  = var.create_elastic_ip ? 1 : 0
  domain = "vpc"

  tags = {
    Name        = "${var.project_name}-bastion-eip-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# EC2 Instance
resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [aws_security_group.bastion.id]
  key_name               = var.ssh_public_key != null ? aws_key_pair.bastion[0].key_name : null
  iam_instance_profile   = aws_iam_instance_profile.bastion.name

  associate_public_ip_address = !var.create_elastic_ip

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    encrypted             = true
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    # Update system
    dnf update -y

    # Install useful tools
    dnf install -y postgresql15 redis6 htop tmux

    # Install AWS CLI v2 (already installed on AL2023)

    # Configure SSH
    sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 60/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveCountMax 3/ClientAliveCountMax 10/' /etc/ssh/sshd_config
    systemctl restart sshd
  EOF

  tags = {
    Name        = "${var.project_name}-bastion-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }

  lifecycle {
    ignore_changes = [ami]
  }
}

# Associate Elastic IP with instance
resource "aws_eip_association" "bastion" {
  count         = var.create_elastic_ip ? 1 : 0
  instance_id   = aws_instance.bastion.id
  allocation_id = aws_eip.bastion[0].id
}
