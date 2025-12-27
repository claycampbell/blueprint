# Bastion Host Module Outputs

output "instance_id" {
  description = "The bastion EC2 instance ID"
  value       = aws_instance.bastion.id
}

output "instance_arn" {
  description = "The bastion EC2 instance ARN"
  value       = aws_instance.bastion.arn
}

output "public_ip" {
  description = "The public IP address of the bastion"
  value       = var.create_elastic_ip ? aws_eip.bastion[0].public_ip : aws_instance.bastion.public_ip
}

output "private_ip" {
  description = "The private IP address of the bastion"
  value       = aws_instance.bastion.private_ip
}

output "security_group_id" {
  description = "The security group ID for the bastion"
  value       = aws_security_group.bastion.id
}

output "iam_role_arn" {
  description = "The IAM role ARN for the bastion"
  value       = aws_iam_role.bastion.arn
}

output "ssh_connection_string" {
  description = "SSH connection string for the bastion"
  value       = var.ssh_public_key != null ? "ssh -i <key-file> ec2-user@${var.create_elastic_ip ? aws_eip.bastion[0].public_ip : aws_instance.bastion.public_ip}" : "Use AWS Systems Manager Session Manager"
}

output "ssm_connection_command" {
  description = "AWS SSM Session Manager connection command"
  value       = "aws ssm start-session --target ${aws_instance.bastion.id}"
}
