import { prisma } from "./prisma";

export interface SendEmailOptions {
  recipientId?: string;
  toEmail: string;
  subject: string;
  studentName: string;
  rollNumber?: string;
  password?: string;
  teamName?: string;
  inviterName?: string;
  semester?: number;
  projectTitle?: string;
  emailType: "REGISTRATION_CREDENTIALS" | "TEAM_INVITATION" | "INVITATION_ACCEPTED" | "GUIDE_REQUEST_SUBMITTED";
}

export async function sendAcademicEmail(options: SendEmailOptions) {
  let htmlBody = "";
  let textBody = "";

  if (options.emailType === "REGISTRATION_CREDENTIALS") {
    textBody = `Dear ${options.studentName},

Welcome to the Academic Project Management Platform (NexusAcademic).
Your student project registration has been approved.

Login Credentials:
------------------------------------------
Institutional Portal: https://nexus-academic.edu/login
College Email: ${options.toEmail}
USN / Roll Number: ${options.rollNumber}
Temporary Password: ${options.password}
------------------------------------------

Important:
1. Use your college email and the temporary password above to log in.
2. Complete your profile (GitHub, LinkedIn, Skills) to facilitate team formation.
3. You can change your password anytime in your settings.

Department of Academic Affairs & Engineering Projects
NexusAcademic Institutional Portal`;

    htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 28px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">NexusAcademic</h1>
          <p style="margin: 6px 0 0 0; color: #bfdbfe; font-size: 13px;">Institutional Academic Project Management Portal</p>
        </div>
        
        <div style="padding: 32px 28px;">
          <p style="font-size: 16px; margin-top: 0; color: #e2e8f0;">Dear <strong>${options.studentName}</strong>,</p>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Your academic project account has been successfully provisioned. You can now form project teams, collaborate with peers, and submit semester projects.
          </p>
          
          <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin: 0 0 14px 0; color: #60a5fa; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Your Login Credentials</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="color: #94a3b8; padding: 6px 0; width: 140px;">College Email:</td>
                <td style="color: #f1f5f9; font-weight: 600; font-family: monospace;">${options.toEmail}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; padding: 6px 0;">Roll Number / USN:</td>
                <td style="color: #f1f5f9; font-weight: 600;">${options.rollNumber}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; padding: 6px 0;">Temporary Password:</td>
                <td style="color: #38bdf8; font-weight: 700; font-size: 16px; font-family: monospace; background: #0f172a; padding: 4px 8px; border-radius: 4px; display: inline-block;">${options.password}</td>
              </tr>
            </table>
          </div>

          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            🔒 <em>For security reasons, never share your credentials with anyone. Make sure to complete your profile with your GitHub and LinkedIn profiles to make team invitations seamless.</em>
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="/login" style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
              Log In to Student Portal &rarr;
            </a>
          </div>
        </div>

        <div style="background-color: #0b0f19; padding: 16px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} NexusAcademic Engineering Portal. Office of Academic Affairs.
        </div>
      </div>
    `;
  } else if (options.emailType === "TEAM_INVITATION") {
    textBody = `Dear ${options.studentName},

${options.inviterName} has invited you to join their project team "${options.teamName}" for Semester ${options.semester}.

Please log in to your Student Portal to Accept or Reject this invitation:
https://nexus-academic.edu/student

NexusAcademic Platform`;

    htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">Project Team Invitation</h2>
        </div>
        <div style="padding: 28px;">
          <p style="color: #e2e8f0; font-size: 15px;">Hello <strong>${options.studentName}</strong>,</p>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            <strong>${options.inviterName}</strong> has invited you to join their project team <strong>"${options.teamName}"</strong> for <strong>Semester ${options.semester}</strong>.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="/student" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
              View & Respond to Invitation &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Persist email to EmailLog table
  const log = await prisma.emailLog.create({
    data: {
      recipientId: options.recipientId,
      toEmail: options.toEmail,
      subject: options.subject,
      htmlBody,
      textBody,
    },
  });

  return log;
}
