# Simple Web App for PDF Display - Deployment Guide

This README outlines the steps to deploy this application on an AWS EC2 instance running Apache.

---

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account.
2. **Domain Name** (Optional): Register a domain if you want to map it to your EC2 instance.
3. **EC2 Instance**:
   - Amazon Linux 2 AMI.
   - Security group allowing HTTP (port 80) and SSH (port 22).

---

## Step 1: Launch an EC2 Instance

1. Go to the EC2 Dashboard in the AWS Console.
2. Launch a new instance using the Amazon Linux 2 AMI.
3. Configure the instance:
   - Choose an instance type (e.g., t2.micro for free tier).
   - Add storage (default is fine).
   - Configure a security group to allow HTTP (port 80) and SSH (port 22).
4. Launch the instance and download the private key (e.g., `mykey.pem`).

---

## Step 2: Connect to the EC2 Instance

1. Open a terminal and SSH into the instance:
   ```bash
   ssh -i mykey.pem ec2-user@<instance-public-ip>
   ```
2. Update the system and install Apache:
   ```bash
   sudo yum update -y
   sudo yum install httpd -y
   ```
3. Start and enable Apache:
   ```bash
   sudo systemctl start httpd
   sudo systemctl enable httpd
   ```
4. Verify the web server is running by visiting `http://<instance-public-ip>`.

---

## Step 3: Transfer Files to the EC2 Instance

1. Use `scp` to transfer the application files:
   ```bash
   scp -i mykey.pem -r ./your-app-folder/ ec2-user@<instance-public-ip>:/var/www/html/
   ```
   Replace `your-app-folder` with the directory containing your project.

2. Ensure the files are placed under `/var/www/html/`:
   ```bash
   sudo mv /var/www/html/your-app-folder/* /var/www/html/
   ```

---

## Step 4: Configure Apache

1. Edit the Apache configuration file to ensure it serves your `index.html`:
   ```bash
   sudo nano /etc/httpd/conf/httpd.conf
   ```

2. Locate and modify the `DirectoryIndex` line to:
   ```
   DirectoryIndex index.html
   ```

3. Restart Apache:
   ```bash
   sudo systemctl restart httpd
   ```

---

## Step 5: Optional - Set Up a Custom Domain

1. Go to your domain registrar (e.g., Namecheap).
2. Update the domain's DNS records:
   - Add an A record pointing to your EC2 instance’s public IP.
3. Wait for DNS propagation (can take up to 48 hours).

---

## Step 6: Verify Deployment

1. Open a web browser and visit your EC2 public IP or custom domain:
   ```
   http://<instance-public-ip>
   ```
   or
   ```
   http://your-domain.com
   ```

2. The PDF display app should now be live and functional.

---

## Notes

- Ensure the `docs` folder contains your PDFs for the app to function correctly.
- Use proper permissions for your files and folders under `/var/www/html/`:
  ```bash
  sudo chmod -R 755 /var/www/html/
  ```
- For production environments, consider enabling HTTPS using a tool like **Certbot** with Let's Encrypt.

---

## Troubleshooting

- If the site doesn’t load, check Apache’s status:
  ```bash
  sudo systemctl status httpd
  ```
- Verify file permissions and ownership:
  ```bash
  sudo chown -R apache:apache /var/www/html/
  ```
- Check the EC2 instance’s security group rules to ensure HTTP traffic is allowed.

---

This guide provides a straightforward way to deploy and run the simple PDF display app on an AWS EC2 instance. For further customization or scaling, refer to AWS and Apache documentation.

