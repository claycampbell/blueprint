# Infrastructure Operations Runbook

## Initial Setup

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform >= 1.6.0 installed
3. S3 bucket for Terraform state (created manually first)

### Creating State Bucket

Before first deployment, create the S3 bucket for Terraform state:

```bash
# Create bucket (do this once per environment)
aws s3api create-bucket \
  --bucket connect2-terraform-state-dev \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket connect2-terraform-state-dev \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket connect2-terraform-state-dev \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### First Deployment

```bash
cd infrastructure/terraform/environments/dev

# Initialize Terraform
terraform init

# Review plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan
```

## Common Operations

### View Current State

```bash
cd infrastructure/terraform/environments/prod
terraform show
```

### View Outputs (for API/Web to consume)

```bash
terraform output -json
```

### Plan Changes

```bash
terraform plan -out=tfplan
```

### Apply Changes

```bash
# Review first!
terraform plan

# Apply
terraform apply
```

### Destroy (DANGEROUS)

```bash
# Only for non-prod environments!
terraform destroy
```

## Troubleshooting

### State Lock Issues

If terraform is stuck due to a stale lock:

```bash
# Get lock ID from error message
terraform force-unlock <LOCK_ID>
```

### State Corruption

```bash
# Pull remote state
terraform state pull > backup.tfstate

# Review and fix
terraform state list
terraform state show <resource>

# Push fixed state (rarely needed)
terraform state push backup.tfstate
```

### Drift Detection

Check if real infrastructure differs from state:

```bash
terraform plan -detailed-exitcode
# Exit code 0 = no changes
# Exit code 2 = changes detected
```

## Scaling Operations

### Increase NAT Gateway Redundancy

Edit `terraform/environments/prod/terraform.tfvars`:

```hcl
# One NAT per AZ for HA
single_nat_gateway = false
```

### Add Availability Zones

```hcl
az_count = 3  # Increase from 2 to 3
```

## Emergency Procedures

### VPC Issues

If VPC has connectivity issues:

1. Check NAT Gateway status in AWS Console
2. Verify route tables have correct routes
3. Check security group rules

```bash
# View VPC details
aws ec2 describe-vpcs --vpc-ids $(terraform output -raw vpc_id)

# Check NAT Gateway
aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=$(terraform output -raw vpc_id)
```

### ECS Cluster Issues

If services can't launch:

1. Check cluster capacity providers
2. Verify Fargate service quotas

```bash
# Check cluster
aws ecs describe-clusters --clusters $(terraform output -raw ecs_cluster_name)

# Check capacity providers
aws ecs describe-cluster-capacity-providers --clusters $(terraform output -raw ecs_cluster_name)
```

### DNS Issues

If DNS resolution fails:

1. Verify hosted zone exists
2. Check NS records are delegated
3. Verify record propagation

```bash
# Check hosted zone
aws route53 get-hosted-zone --id $(terraform output -raw route53_zone_id)

# List records
aws route53 list-resource-record-sets --hosted-zone-id $(terraform output -raw route53_zone_id)

# Test resolution
dig +short api.connect2.com
```

## Maintenance Windows

### Recommended Maintenance Schedule

- **Dev**: Anytime
- **Staging**: Business hours (notify team)
- **Prod**: Scheduled maintenance windows (weekends, off-hours)

### Pre-Maintenance Checklist

1. [ ] Notify stakeholders
2. [ ] Verify backup state exists
3. [ ] Run `terraform plan` and review
4. [ ] Ensure rollback plan is ready
5. [ ] Have AWS Console access ready

### Post-Maintenance Checklist

1. [ ] Verify `terraform apply` succeeded
2. [ ] Check API health endpoint
3. [ ] Check Web app loads
4. [ ] Review CloudWatch for errors
5. [ ] Update stakeholders

## Cost Optimization

### NAT Gateway

NAT Gateway is one of the most expensive shared resources. To reduce costs:

- Dev: Single NAT Gateway (`single_nat_gateway = true`)
- Staging: Single NAT Gateway
- Prod: NAT per AZ for HA

### Container Insights

Disable Container Insights in dev to save costs:

```hcl
enable_container_insights = false  # dev
enable_container_insights = true   # staging/prod
```

## Security

### Rotating Credentials

If AWS credentials are compromised:

1. Rotate IAM access keys immediately
2. Review CloudTrail for unauthorized activity
3. Check for unauthorized resources
4. Update GitHub Secrets with new credentials

### Audit Logging

All infrastructure changes are logged via:

- Terraform state history (S3 versioning)
- GitHub Actions workflow logs
- AWS CloudTrail
