output "instance_id" {
  description = "ID of the bastion EC2 instance"
  value       = aws_instance.bastion.id
}

output "instance_arn" {
  description = "ARN of the bastion EC2 instance"
  value       = aws_instance.bastion.arn
}

output "public_ip" {
  description = "Public IP of the bastion host"
  value       = var.create_elastic_ip ? aws_eip.bastion[0].public_ip : aws_instance.bastion.public_ip
}

output "private_ip" {
  description = "Private IP of the bastion host"
  value       = aws_instance.bastion.private_ip
}

output "security_group_id" {
  description = "ID of the bastion security group"
  value       = aws_security_group.bastion.id
}

output "ssh_connection_string" {
  description = "SSH connection command"
  value       = var.ssh_public_key != null ? "ssh -i <key-file> ec2-user@${var.create_elastic_ip ? aws_eip.bastion[0].public_ip : aws_instance.bastion.public_ip}" : "Use AWS SSM Session Manager: aws ssm start-session --target ${aws_instance.bastion.id}"
}

output "ssm_connection_string" {
  description = "SSM Session Manager connection command"
  value       = "aws ssm start-session --target ${aws_instance.bastion.id}"
}
