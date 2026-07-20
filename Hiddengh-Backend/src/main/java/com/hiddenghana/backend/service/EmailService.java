package com.hiddenghana.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verifyLink = baseUrl + "/api/auth/verify-email?token=" + token;

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2 style="color:#1a7a3c;">Welcome to Hidden Ghana, %s!</h2>
                    <p>Tap the button below to verify your email address and activate your account.</p>
                    <a href="%s" style="display:inline-block; padding:12px 24px; background:#1a7a3c; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
                        Verify Email
                    </a>
                    <p style="margin-top:24px; color:#666; font-size:13px;">
                        This link expires in 24 hours. If you didn't create an account, you can ignore this email.
                    </p>
                </div>
                """.formatted(fullName, verifyLink);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setFrom(fromAddress);
            helper.setSubject("Verify your Hidden Ghana account");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            // Best-effort: a misconfigured/missing SMTP must never break
            // registration or login. Log and continue without the email.
            System.err.println("WARN: verification email not sent to " + toEmail + ": " + e.getMessage());
        }
    }
}