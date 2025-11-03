import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollText, Shield, AlertTriangle, Scale, Users, Globe } from "lucide-react"

const TermsOfService = () => {
  const lastUpdated = "September 15, 2025"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ScrollText className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
        <div className="flex justify-center">
          <Badge variant="outline">Last updated: {lastUpdated}</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Please read these Terms of Service carefully before using Coderyn. 
          By accessing or using our service, you agree to be bound by these terms.
        </p>
      </div>

      {/* Quick Overview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Quick Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Coderyn is a license management and authentication platform. These terms govern your use of our 
            services, including account creation, license management, reseller partnerships, and data handling. 
            By using our platform, you agree to comply with these terms and our Privacy Policy.
          </p>
        </CardContent>
      </Card>

      {/* Terms Sections */}
      <div className="space-y-6">
        {/* 1. Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By creating an account, accessing, or using Coderyn ("the Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all users of the Service, including administrators, resellers, and end users.
            </p>
          </CardContent>
        </Card>

        {/* 2. Description of Service */}
        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Coderyn provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Authentication and user management services</li>
              <li>License key generation and management</li>
              <li>Reseller partnership and distribution tools</li>
              <li>Application access control and monitoring</li>
              <li>Analytics and reporting dashboards</li>
              <li>API access for integration with your applications</li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. User Accounts and Registration */}
        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Account Creation:</strong> You must provide accurate, complete, and current information when 
              creating an account. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            <p className="text-muted-foreground">
              <strong>Account Types:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li><strong>Administrator Accounts:</strong> Full platform access with user and license management capabilities</li>
              <li><strong>Reseller Accounts:</strong> Limited access for license generation within assigned quotas</li>
              <li><strong>End User Accounts:</strong> License-based access managed through the platform</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Account Security:</strong> You are responsible for all activities under your account. 
              Notify us immediately of any unauthorized access.
            </p>
          </CardContent>
        </Card>

        {/* 4. License Management */}
        <Card>
          <CardHeader>
            <CardTitle>4. License Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>License Creation:</strong> Administrators can create and manage license keys for their applications. 
              Resellers can generate licenses within their assigned quotas.
            </p>
            <p className="text-muted-foreground">
              <strong>License Usage:</strong> Each license key is unique and tied to specific applications. 
              Hardware ID (HWID) verification may be enforced to prevent unauthorized sharing.
            </p>
            <p className="text-muted-foreground">
              <strong>Expiration:</strong> Licenses may have expiration dates. Expired licenses will cease to function 
              unless renewed through the platform.
            </p>
          </CardContent>
        </Card>

        {/* 5. Reseller Program */}
        <Card>
          <CardHeader>
            <CardTitle>5. Reseller Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Reseller Accounts:</strong> Resellers are authorized partners who can generate and distribute 
              license keys within their assigned quotas and applications.
            </p>
            <p className="text-muted-foreground">
              <strong>Quotas and Limits:</strong> Resellers must operate within their assigned license generation limits. 
              Exceeding quotas may result in account suspension.
            </p>
            <p className="text-muted-foreground">
              <strong>Responsibilities:</strong> Resellers are responsible for their own customer relationships and 
              support. They must comply with all applicable laws and regulations.
            </p>
          </CardContent>
        </Card>

        {/* 6. Acceptable Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              6. Acceptable Use Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Share, sell, or distribute license keys outside of authorized channels</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Use the Service to distribute malware or harmful content</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </CardContent>
        </Card>

        {/* 7. Data and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>7. Data and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Data Collection:</strong> We collect and process data as described in our Privacy Policy, 
              including account information, usage data, and system information for HWID verification.
            </p>
            <p className="text-muted-foreground">
              <strong>Data Security:</strong> We implement industry-standard security measures to protect your data, 
              including encryption, secure authentication, and access controls.
            </p>
            <p className="text-muted-foreground">
              <strong>Data Retention:</strong> We retain data as necessary to provide the Service and comply with 
              legal obligations. You may request data deletion subject to our retention policies.
            </p>
          </CardContent>
        </Card>

        {/* 8. Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle>8. Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Uptime:</strong> We strive to maintain high service availability but do not guarantee 
              uninterrupted access. Scheduled maintenance will be announced in advance when possible.
            </p>
            <p className="text-muted-foreground">
              <strong>Service Modifications:</strong> We may modify, suspend, or discontinue any part of the Service 
              with reasonable notice. Critical security updates may be applied immediately.
            </p>
          </CardContent>
        </Card>

        {/* 9. Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>9. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Our Rights:</strong> Coderyn and all related trademarks, logos, and intellectual property 
              are owned by us. You may not use our intellectual property without permission.
            </p>
            <p className="text-muted-foreground">
              <strong>Your Content:</strong> You retain ownership of your applications and data. By using the Service, 
              you grant us necessary rights to provide the Service to you.
            </p>
          </CardContent>
        </Card>

        {/* 10. Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-muted-foreground" />
              10. Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, 
              DATA, OR USE, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE.
            </p>
            <p className="text-muted-foreground">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE 
              TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </CardContent>
        </Card>

        {/* 11. Termination */}
        <Card>
          <CardHeader>
            <CardTitle>11. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>By You:</strong> You may terminate your account at any time by contacting us or using 
              account deletion features where available.
            </p>
            <p className="text-muted-foreground">
              <strong>By Us:</strong> We may suspend or terminate accounts that violate these Terms, engage in 
              fraudulent activity, or pose security risks. We will provide notice when possible.
            </p>
            <p className="text-muted-foreground">
              <strong>Effect of Termination:</strong> Upon termination, your access to the Service will cease, 
              and associated licenses may be deactivated. Data retention will follow our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* 12. Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may update these Terms from time to time. Material changes will be communicated through 
              the Service or via email. Continued use of the Service after changes constitutes acceptance 
              of the updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* 13. Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              13. Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground">Coderyn Support</p>
              <p className="text-muted-foreground">Website: coderyn.sbs</p>
              <p className="text-muted-foreground">Discord: https://discord.gg/hag6TZ7urH</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card className="border-muted">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            These Terms of Service are effective as of {lastUpdated} and govern your use of Coderyn.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TermsOfService