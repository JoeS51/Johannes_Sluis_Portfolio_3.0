const post = {
  slug: 'ssh-portfolio-guide',
  frontmatter: {
    title: 'Building an SSH Portfolio',
    description:
      'A practical guide to building an SSH portfolio with Charm and hosting it on port 22 without losing admin access.',
    date: '2026-01-31',
    tags: ['Go', 'Side project', 'Devops'],
    cover: null
  },
  content: `
# Motivation

<video class="blog-video" autoplay muted playsinline loop>
  <source src="/images/ssh-demo.mp4" type="video/mp4" />
</video>

I remember seeing people publish portfolios you visit over SSH, and wondering:
1) how that is possible, and
2) how much infrastructure it actually takes.

I was curious enough to build it myself, and I'll be talking about: what SSH is, why to build one, how [Charm](https://charm.land/) makes it easy, and how to host it properly without breaking your admin access.

---

## What is SSH (quickly)?

SSH (Secure Shell) is a protocol that lets you securely connect to another machine over the internet and get a terminal session. Normally, you use it to manage servers like an Azure VM or AWS EC2 instance.

\`\`\`
ssh user@server.com
\`\`\`

But SSH does not have to be just for sysadmin work. In this case, it can be used for something more fun like *an SSH portfolio*.

---

## What is an SSH portfolio?

It is a terminal UI that people can SSH into and explore, like a regular portfolio website, but inside the terminal.

If you have seen ThePrimeagen's terminal.shop that is a great example of what I was going for.

![terminal.shop example](/images/terminal-shop.png)

---

## How to build your own

There are frameworks that make it easier to build terminal user interfaces (TUIs) without wiring everything from scratch. I decided to build mine using the Charm stack, which is a Go-based toolkit for SSH apps and terminal UIs.

When people say "Charm stack" for SSH apps, they usually mean:

- **Wish**: an SSH server that boots your TUI per connection.
- **Bubble Tea**: the state machine that renders the UI and handles input.
- **Bubbles**: reusable UI components like lists, text inputs, and spinners.
- **Lip Gloss**: styling primitives (colors, layout, borders) for the terminal.

---

## How to use the Charm stack

The workflow is simple:

1) Set up a tiny Go project and install the Charm stack.
\`\`\`bash
mkdir ssh-portfolio
cd ssh-portfolio
go mod init ssh-portfolio
go get github.com/charmbracelet/wish github.com/charmbracelet/wish/bubbletea github.com/charmbracelet/bubbletea github.com/charmbracelet/ssh github.com/charmbracelet/lipgloss
\`\`\`

2) Clean up the module files so everything resolves cleanly.
\`\`\`bash
go mod tidy
\`\`\`

3) Create main.go with the server + UI code.
\`\`\`go
package main

import (
    tea "github.com/charmbracelet/bubbletea"
    "github.com/charmbracelet/lipgloss"
    "github.com/charmbracelet/ssh"
    "github.com/charmbracelet/wish"
    wishtea "github.com/charmbracelet/wish/bubbletea"
)

type model struct {
    title string
    sections []string
}

func initialModel() model {
    return model{
        title: "Joe Sluis - SSH Portfolio",
        sections: []string{"About", "Projects", "Experience", "Contact"},
    }
}

func (m model) Init() tea.Cmd {
    return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "q", "ctrl+c":
            return m, tea.Quit
        }
    }

    return m, nil
}

func (m model) View() string {
    titleStyle := lipgloss.NewStyle().
        Bold(true).
        Foreground(lipgloss.Color("#E2E8F0")).
        Background(lipgloss.Color("#0F172A")).
        Padding(0, 1)

    sectionStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("#94A3B8"))

    footerStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("#64748B"))

    output := titleStyle.Render(m.title) + "\\n\\n"

    output += "Sections:\\n"
    for _, section := range m.sections {
        output += sectionStyle.Render("- " + section) + "\\n"
    }

    output += "\\n" + footerStyle.Render("Press q to quit.") + "\\n"

    return output
}

func main() {
    server, _ := wish.NewServer(
        wish.WithAddress("0.0.0.0:2222"),
        wish.WithHostKeyPath(".ssh/host_ed25519"),
        wish.WithMiddleware(wishtea.Middleware(teaHandler)),
    )

    _ = server.ListenAndServe()
}

func teaHandler(s ssh.Session) (tea.Model, []tea.ProgramOption) {
    return initialModel(), []tea.ProgramOption{
        tea.WithAltScreen(),
    }
}
\`\`\`

4) Generate a host key (Wish needs one to run SSH).
\`\`\`bash
mkdir -p .ssh
ssh-keygen -t ed25519 -f .ssh/host_ed25519 -N ""
\`\`\`

5) Run the server locally.
\`\`\`bash
go run .
\`\`\`

6) In another terminal, connect to it.
\`\`\`bash
ssh localhost -p 2222
\`\`\`

What is happening here:

- **Wish bootstraps SSH**: wish.NewServer spins up an SSH server and listens on a port (2222 here so it is safe in development).
- **Host keys**: WithHostKeyPath points to the server key, which SSH uses to identify your host.
- **Per-connection UI**: wishtea.Middleware connects each incoming SSH session to a Bubble Tea program. Think of it as “start a fresh TUI for every user.”
- **Alt screen**: tea.WithAltScreen() gives you a clean terminal buffer that exits without leaving artifacts.
- **Basic styling**: Lip Gloss styles the title, section list, and footer without adding much code.

Once this is running, you can SSH into it locally with: ssh localhost -p 2222 and see whatever UI your model renders.

How the UI works (based on the main.go code above):

- **Model**: your app state. Here it is just a title string, but you can add sections, selected index, or data fetched from files.
- **Init**: runs once at startup. Returning nil means “no initial command.” Later you can return commands to load data or start timers.
- **Update**: handles input and state changes. When the user hits q or ctrl+c, we return tea.Quit to exit the program.
- **View**: converts your state into a string. This is where you build layout (Lip Gloss) or render lists (Bubbles).

This loop (Init → Update → View) is the whole Bubble Tea mental model. Start simple, then add a list component for sections, use Lip Gloss to style headers, and map keys to navigate between pages in your portfolio.

This is enough to prove the end-to-end flow. Once it works, replace the view with a list (Bubbles), add styling (Lip Gloss), and add sections for projects, about, and contact.

---

## Hosting options (Azure, EC2, Fly.io)

You can host this anywhere that gives you a public IP and lets you control port 22:

- **Azure VMs**
- **AWS EC2**
- **Fly.io**

I went with **EC2** because I had AWS credits.

---

## Build and ship the binary (EC2 example)

Before you can run it on a VM, you need a Linux binary and a way to copy it over.

1) Build a Linux binary locally.
\`\`\`bash
GOOS=linux GOARCH=amd64 go build -o ssh-portfolio
\`\`\`

2) Copy it to your EC2 instance with scp.
\`\`\`bash
scp -i ~/.ssh/your-key.pem -P 22022 ./ssh-portfolio ec2-user@your-ec2-ip:/home/ec2-user/ssh-portfolio
\`\`\`

3) SSH into the instance and make it executable.
\`\`\`bash
ssh -i ~/.ssh/your-key.pem -p 22022 ec2-user@your-ec2-ip
chmod +x /home/ec2-user/ssh-portfolio
\`\`\`

If your instance is arm64 (like Graviton), swap GOARCH to arm64.

---

## The port 22 problem (and why it matters)

Port **22** is the default SSH port. If you want people to simply run:

\`\`\`
ssh yourdomain.com
\`\`\`

your app must listen on **port 22**.

But there is a catch:

- **Your admin SSH** also runs on port 22 by default.
- You cannot run two SSH servers on the same port.

So the fix is:

1) move admin SSH to a different port (like 22022)
2) put the portfolio app on port 22

---

## How we moved admin SSH

On the VM:

1. Edit \`/etc/ssh/sshd_config\`
2. Add:
   \`\`\`
   Port 22022
   \`\`\`
3. Restart SSH:
   \`\`\`
   sudo systemctl restart sshd
   \`\`\`

Then update the cloud firewall (AWS Security Group):

- TCP **22022** from your own IP (admin)
- TCP **22** from the world (portfolio)

---

## Running the app on port 22

Binding to port 22 requires elevated permission, so you give the binary the right capability:

\`\`\`
sudo setcap 'cap_net_bind_service=+ep' /home/ec2-user/joe-ssh-linux
\`\`\`

Then run it with systemd so it stays up:

\`\`\`
sudo systemctl enable --now joe-ssh
\`\`\`

---

## Adding a domain

Once the app is live on port 22, add an \`A\` record pointing your domain to the VM's public IP. For example:

- \`ssh.yourdomain.com -> YOUR_IP\`
- \`joesluis.dev -> YOUR_IP\`

If you use Cloudflare, make sure the record is **DNS only** (not proxied), since SSH cannot go through their proxy.

---

## Final test

From any machine:

\`\`\`
ssh yourdomain.com
\`\`\`

And you should see your terminal portfolio.
`
};

export default post;
