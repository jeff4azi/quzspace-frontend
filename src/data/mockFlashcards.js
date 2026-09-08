export const mockFlashcards = [
  {
    id: "fc-1",
    front: "What are the 7 layers of the OSI model in order from Layer 1 to Layer 7?",
    back: "Physical, Data Link, Network, Transport, Session, Presentation, Application. (Mnemonic: Please Do Not Touch Steve's Pet Alligator)",
    mastered: true,
  },
  {
    id: "fc-2",
    front: "What is the primary function of the Address Resolution Protocol (ARP)?",
    back: "ARP maps a known IPv4 address (Layer 3) to its corresponding physical MAC address (Layer 2) on a local network segment.",
    mastered: true,
  },
  {
    id: "fc-3",
    front: "Explain the key differences between TCP and UDP.",
    back: "TCP is connection-oriented, reliable, guarantees packet ordering, and features flow/congestion control. UDP is connectionless, unreliable, lightweight, and low-latency.",
    mastered: false,
  },
  {
    id: "fc-4",
    front: "What packets are exchanged during a TCP 3-Way Handshake?",
    back: "1. Client sends SYN\n2. Server responds with SYN-ACK\n3. Client confirms with ACK, establishing the TCP connection.",
    mastered: true,
  },
  {
    id: "fc-5",
    front: "What default TCP ports are used by HTTP and HTTPS?",
    back: "HTTP uses TCP Port 80 (unencrypted). HTTPS uses TCP Port 443 (encrypted via TLS/SSL).",
    mastered: true,
  },
  {
    id: "fc-6",
    front: "What does CIDR notation /24 represent in IP addressing?",
    back: "A 24-bit subnet mask (255.255.255.0) allocating 256 total IP addresses, yielding 254 usable host addresses.",
    mastered: false,
  },
  {
    id: "fc-7",
    front: "What is the purpose of the Time-To-Live (TTL) field in an IPv4 packet header?",
    back: "TTL prevents packets from circulating indefinitely in routing loops by decrementing by 1 at each router hop. When TTL reaches 0, the packet is dropped.",
    mastered: true,
  },
  {
    id: "fc-8",
    front: "How long is a MAC address in bits and how is it formatted?",
    back: "48 bits (6 bytes), typically written as 12 hexadecimal digits separated by colons or hyphens (e.g. 00:1A:2B:3C:4D:5E).",
    mastered: true,
  },
  {
    id: "fc-9",
    front: "Differentiate between a Hub, Switch, and Router.",
    back: "Hub (Layer 1): Broadcasts data to all ports.\nSwitch (Layer 2): Forwards frames to specific ports using MAC tables.\nRouter (Layer 3): Routes packets across networks using IP routing tables.",
    mastered: false,
  },
  {
    id: "fc-10",
    front: "What is the function of DHCP in a local network?",
    back: "Dynamic Host Configuration Protocol automatically assigns IP addresses, subnet masks, default gateways, and DNS server addresses to client devices.",
    mastered: true,
  },
  {
    id: "fc-11",
    front: "What is BGP and at which OSI layer does it operate?",
    back: "Border Gateway Protocol is the standardized path-vector routing protocol of the Internet that operates at the Application Layer (Layer 7) over TCP port 179.",
    mastered: false,
  },
  {
    id: "fc-12",
    front: "What is ICMP used for in networking?",
    back: "Internet Control Message Protocol is used by network devices to send error messages and operational info (e.g., used by ping for echo requests/replies and traceroute).",
    mastered: false,
  },
];
