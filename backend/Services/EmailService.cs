using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
        {
            var settings = _configuration.GetSection("EmailSettings");
            var smtpHost     = settings["SmtpHost"]       ?? "smtp.gmail.com";
            var smtpPort     = int.Parse(settings["SmtpPort"] ?? "587");
            var senderEmail  = settings["SenderEmail"]    ?? "";
            var senderName   = settings["SenderName"]     ?? "BiteBoard";
            var password     = settings["SenderPassword"] ?? "";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body style='margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f5;padding:40px 0;'>
    <tr><td align='center'>
      <table width='520' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>
        <!-- Header -->
        <tr>
          <td style='background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;text-align:center;'>
            <h1 style='margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;'>
              🍽️ BiteBoard
            </h1>
            <p style='margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;'>Meal Management System</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style='padding:36px 40px;'>
            <h2 style='margin:0 0 12px;color:#1a1a2e;font-size:20px;font-weight:700;'>Reset your password</h2>
            <p style='margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.7;'>
              We received a request to reset the password for your BiteBoard account associated with <strong>{toEmail}</strong>.
              Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <!-- CTA Button -->
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td align='center' style='padding:8px 0 24px;'>
                  <a href='{resetLink}' style='display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:50px;padding:14px 36px;letter-spacing:0.3px;'>
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            <p style='margin:0 0 8px;color:#9ca3af;font-size:12px;'>Or copy and paste this link into your browser:</p>
            <p style='margin:0 0 24px;word-break:break-all;font-size:12px;color:#6366f1;'>{resetLink}</p>
            <hr style='border:none;border-top:1px solid #f1f5f9;margin:0 0 20px;'>
            <p style='margin:0;color:#9ca3af;font-size:12px;line-height:1.6;'>
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style='background:#f8fafc;padding:20px 40px;text-align:center;'>
            <p style='margin:0;color:#9ca3af;font-size:11px;'>© 2025 BiteBoard · Meal Management System</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>";

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(senderEmail, password)
            };

            var mail = new MailMessage
            {
                From       = new MailAddress(senderEmail, senderName),
                Subject    = "Reset your BiteBoard password",
                Body       = htmlBody,
                IsBodyHtml = true
            };
            mail.To.Add(toEmail);

            await client.SendMailAsync(mail);
        }
    }
}
