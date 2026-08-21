/**
 * Validates whether an email belongs to a recognized academic / college domain.
 */
export function validateCollegeEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email address is required" };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address format" };
  }

  const [, domain] = trimmed.split("@");

  // Block generic consumer domains
  const blockedPublicDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "mail.com",
    "protonmail.com",
    "zoho.com",
    "yandex.com",
  ];

  if (blockedPublicDomains.includes(domain)) {
    return {
      isValid: false,
      error: `Institutional email required. Personal accounts like @${domain} are not permitted for academic project registration. Use your college email (e.g. @rvce.edu.in, @campus.edu, @college.ac.in, or any .edu/.ac domain).`,
    };
  }

  // Check for academic domain suffixes or keywords
  const isAcademic =
    domain.endsWith(".edu") ||
    domain.endsWith(".ac.in") ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".ac.uk") ||
    domain.endsWith(".edu.au") ||
    domain.endsWith(".ac") ||
    domain.includes("college") ||
    domain.includes("campus") ||
    domain.includes("univ") ||
    domain.includes("institute") ||
    domain.includes("engg") ||
    domain.includes("academy") ||
    domain.includes(".school") ||
    domain.endsWith(".org"); // allowed for educational trusts/colleges

  if (!isAcademic) {
    return {
      isValid: false,
      error: "Please use an authorized college email address (must end with .edu, .ac.in, .edu.in, or your institution's academic domain).",
    };
  }

  return { isValid: true };
}
