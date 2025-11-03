import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Database, Users, Globe, AlertCircle, CheckCircle } from "lucide-react"

const PrivacyPolicy = () => {
  const lastUpdated = "September 15, 2025"

  const dataTypes = [
    {
      category: "Account Information",
      items: ["Name", "Email address", "Password (encrypted)", "Account creation date"],
      purpose: "Account management and authentication"
    },
    {
      category: "Application Data",
      items: ["App names", "App versions", "App IDs", "License configurations"],
      purpose: "Service functionality and license management"
    },
    {
      category: "License Information",
      items: ["License keys", "Expiration dates", "Usage status", "Creation timestamps"],
      purpose: "License tracking and management"
    },
    {
      category: "System Information",
      items: ["Hardware IDs (HWID)", "IP addresses", "Browser information", "Device identifiers"],
      purpose: "Security verification and fraud prevention"
    },
    {
      category: "Usage Analytics",
      items: ["Login times", "Feature usage", "API calls", "Error logs"],
      purpose: "Service improvement and troubleshooting"
    }
  ]

  const securityMeasures = [
    "End-to-end encryption for sensitive data",
    "Secure password hashing with bcrypt",
    "JWT token-based authentication",
    "Role-based access control (RBAC)",
    "Regular security audits and updates",
    "Secure database connections with SSL/TLS",
    "Activity logging and monitoring",
    "Hardware ID verification for license protection"
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <div className="flex justify-center">
          <Badge variant="outline">Last updated: {lastUpdated}</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This Privacy Policy explains how Coderyn collects, 
          uses, and protects your information when you use our authentication and license management platform.
        </p>
      </div>

      {/* Privacy Commitment */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Our Privacy Commitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We are committed to protecting your privacy and ensuring the security of your personal information. 
            We only collect data necessary to provide our services, implement strong security measures, 
            and never sell your personal information to third parties.
          </p>
        </CardContent>
      </Card>

      {/* Information We Collect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            1. Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We collect information to provide, maintain, and improve our services. The types of information 
            we collect depend on how you use Coderyn:
          </p>
          
          <div className="space-y-4">
            {dataTypes.map((type, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">{type.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Data collected:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {type.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Purpose:</p>
                    <p className="text-sm text-muted-foreground">{type.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How We Use Information */}
      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">We use the collected information for the following purposes:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Service Provision</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>User authentication and account management</li>
                <li>License key generation and validation</li>
                <li>Application access control</li>
                <li>Reseller account management</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Security & Compliance</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Fraud prevention and detection</li>
                <li>Hardware ID verification</li>
                <li>Security monitoring and logging</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Service Improvement</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Analytics and usage statistics</li>
                <li>Performance optimization</li>
                <li>Feature development</li>
                <li>Technical support</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Communication</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Service notifications</li>
                <li>Security alerts</li>
                <li>Account updates</li>
                <li>Customer support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            3. Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We implement comprehensive security measures to protect your information:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{measure}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>4. Information Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground mb-2">We do not sell your personal information.</p>
            <p className="text-sm text-muted-foreground">
              We may share information only in the following limited circumstances:
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Service Providers</h3>
              <p className="text-sm text-muted-foreground">
                We may share data with trusted third-party service providers who help us operate our platform 
                (e.g., cloud hosting, analytics). These providers are bound by strict confidentiality agreements.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
              <p className="text-sm text-muted-foreground">
                We may disclose information when required by law, court order, or to protect our rights, 
                property, or safety, or that of our users or others.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Business Transfers</h3>
              <p className="text-sm text-muted-foreground">
                In the event of a merger, acquisition, or sale of assets, user information may be transferred 
                as part of the transaction, subject to the same privacy protections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle>5. Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We retain your information for as long as necessary to provide our services and comply with legal obligations:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-foreground">Account Data</p>
                <p className="text-sm text-muted-foreground">Retained while your account is active and for a reasonable period after deletion</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-foreground">License Information</p>
                <p className="text-sm text-muted-foreground">Retained for the license validity period plus additional time for support and compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-foreground">Usage Logs</p>
                <p className="text-sm text-muted-foreground">Typically retained for 12-24 months for security and analytics purposes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            6. Your Rights and Choices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">You have the following rights regarding your personal information:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Access</h3>
                <p className="text-sm text-muted-foreground">Request access to your personal information</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Correction</h3>
                <p className="text-sm text-muted-foreground">Update or correct inaccurate information</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Deletion</h3>
                <p className="text-sm text-muted-foreground">Request deletion of your account and data</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Portability</h3>
                <p className="text-sm text-muted-foreground">Export your data in a structured format</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Restriction</h3>
                <p className="text-sm text-muted-foreground">Limit how we process your information</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Objection</h3>
                <p className="text-sm text-muted-foreground">Object to certain types of processing</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              To exercise these rights, please contact us via our website coderyn.sbs. 
              We will respond to your request within 30 days.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookies and Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We use cookies and similar technologies to enhance your experience:
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Required for authentication, security, and basic functionality. These cannot be disabled.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Help us understand how you use our platform to improve performance and user experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Preference Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Remember your settings and preferences, such as theme selection and language.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Transfers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            8. International Data Transfers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data during international transfers, 
            including:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Adequacy decisions by relevant authorities</li>
            <li>Standard contractual clauses</li>
            <li>Certification schemes and codes of conduct</li>
            <li>Binding corporate rules where applicable</li>
          </ul>
        </CardContent>
      </Card>

      {/* Children's Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            9. Children's Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Coderyn is not intended for use by children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If we become aware that we have collected 
            personal information from a child under 13, we will take steps to delete such information.
          </p>
        </CardContent>
      </Card>

      {/* Changes to Privacy Policy */}
      <Card>
        <CardHeader>
          <CardTitle>10. Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices or 
            applicable laws. We will notify you of material changes by posting the updated policy on our 
            platform and updating the "Last updated" date. Your continued use of our services after 
            changes become effective constitutes acceptance of the updated Privacy Policy.
          </p>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            11. Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-foreground">Coderyn Privacy Team</p>
            <p className="text-muted-foreground">Website: coderyn.sbs</p>
            <p className="text-muted-foreground">Discord: https://discord.gg/hag6TZ7urH</p>
            <p className="text-muted-foreground">Address: [Your Business Address]</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-muted">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            This Privacy Policy is effective as of {lastUpdated} and applies to all information collected by Coderyn.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default PrivacyPolicy