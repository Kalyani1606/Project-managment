const BASE = "http://localhost:3000";

async function runTests() {
  console.log("=== Testing NexusAcademic E2E Endpoints ===");

  // 1. Test Login
  console.log("\n1. Testing Student Login API...");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "aman.verma@engg.college.edu",
      password: "Acad#Demo2026!",
    }),
  });
  console.log("Login status:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("Logged in user:", loginData.user?.name, "Role:", loginData.user?.role);
  const cookie = loginRes.headers.get("set-cookie") || "";

  // 2. Test Me endpoint
  console.log("\n2. Testing /api/auth/me...");
  const meRes = await fetch(`${BASE}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  const meData = await meRes.json();
  console.log("Auth session valid:", !!meData.user, "Name:", meData.user?.name);

  // 3. Test Student Search API
  console.log("\n3. Testing /api/students/search?q=Priya...");
  const searchRes = await fetch(`${BASE}/api/students/search?q=Priya`, {
    headers: { Cookie: cookie },
  });
  const searchData = await searchRes.json();
  console.log("Search results count:", searchData.students?.length);
  if (searchData.students?.length > 0) {
    console.log("Found student:", searchData.students[0].name, searchData.students[0].rollNumber);
  }

  // 4. Test Staff API
  console.log("\n4. Testing /api/staff...");
  const staffRes = await fetch(`${BASE}/api/staff`, {
    headers: { Cookie: cookie },
  });
  const staffData = await staffRes.json();
  console.log("Staff mentors available:", staffData.staff?.length);
  if (staffData.staff?.length > 0) {
    console.log("First mentor:", staffData.staff[0].name, staffData.staff[0].areasOfExpertise);
  }

  // 5. Test Projects List
  console.log("\n5. Testing /api/projects...");
  const projRes = await fetch(`${BASE}/api/projects`, {
    headers: { Cookie: cookie },
  });
  const projData = await projRes.json();
  console.log("Projects retrieved:", projData.projects?.length);

  // 6. Test Team Creation + Invite
  console.log("\n6. Testing Team Creation & Invitation...");
  const teamRes = await fetch(`${BASE}/api/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ teamName: "Autonomous Flight Systems", semester: 6 }),
  });
  const teamData = await teamRes.json();
  console.log("Team created status:", teamRes.status, "Team ID:", teamData.team?.id);

  if (searchData.students?.length > 0 && teamData.team?.id) {
    const targetStudent = searchData.students[0];
    const inviteRes = await fetch(`${BASE}/api/teams/${teamData.team.id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ targetUserId: targetStudent.id }),
    });
    console.log("Invite dispatched status:", inviteRes.status);
    const inviteData = await inviteRes.json();
    console.log("Invite message:", inviteData.message || inviteData.error);
  }

  // 7. Test Notifications API
  console.log("\n7. Testing /api/notifications...");
  const notifRes = await fetch(`${BASE}/api/notifications`, {
    headers: { Cookie: cookie },
  });
  const notifData = await notifRes.json();
  console.log("Notifications count:", notifData.notifications?.length, "Unread:", notifData.unreadCount);

  // 8. Test Dev Email Log API
  console.log("\n8. Testing /api/emails/recent...");
  const emailRes = await fetch(`${BASE}/api/emails/recent`);
  const emailData = await emailRes.json();
  console.log("Dispatched institutional emails:", emailData.emails?.length);
  if (emailData.emails?.length > 0) {
    console.log("Latest email to:", emailData.emails[0].toEmail, "Subject:", emailData.emails[0].subject);
  }

  console.log("\n=== All E2E Backend & Workflow Tests Complete! ===");
}

runTests().catch(console.error);
