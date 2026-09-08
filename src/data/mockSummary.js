export const mockSummary = {
  generatedAt: "Generated 2 hours ago",
  keyPoints: [
    "The OSI Reference Model divides network communication into 7 distinct layers, whereas the TCP/IP stack condenses it into 4 practical layers.",
    "Encapsulation applies headers at each descending layer (Data → Segment → Packet → Frame → Bits) during transmission.",
    "Subnetting utilizes subnet masks to partition IP address spaces into logical sub-networks for improved routing efficiency and security.",
    "TCP provides reliable, connection-oriented byte streams with flow and congestion control, unlike connectionless UDP datagrams.",
    "DNS resolution translates human-readable domain names into 32-bit IPv4 or 128-bit IPv6 addresses via hierarchical querying.",
  ],
  definitions: [
    {
      term: "TCP 3-Way Handshake",
      definition: "The connection establishment process using SYN, SYN-ACK, and ACK packets to synchronize sequence numbers before data transfer.",
    },
    {
      term: "Subnet Mask",
      definition: "A 32-bit mask used to differentiate the network ID portion from the host ID portion in an IP address.",
    },
    {
      term: "DNS Recursive Resolver",
      definition: "The initial DNS server contacted by a client that queries root, TLD, and authoritative nameservers on the client's behalf.",
    },
    {
      term: "MAC Address",
      definition: "A unique 48-bit hardware address assigned to a network interface card (NIC) for Link Layer local communication.",
    },
    {
      term: "Latency vs Throughput",
      definition: "Latency measures the delay for a single packet to travel from source to destination, while throughput measures total data transferred per unit of time.",
    },
  ],
  mainConcepts: [
    {
      title: "The 7-Layer OSI Reference Architecture",
      description: "The Open Systems Interconnection (OSI) model provides a conceptual framework for understanding network communication protocols. Each layer serves the layer above it and receives services from the layer below. Data flows down the stack on the sender side through encapsulation and up the stack on the receiver side through decapsulation.",
    },
    {
      title: "Packet Switching & Router Hop Mechanics",
      description: "Unlike circuit-switched networks that reserve dedicated paths, packet switching divides messages into autonomous packets. Routers examine destination IP addresses at the Network Layer (Layer 3) and consult routing tables to forward packets across intermediate network hops toward their final destination.",
    },
    {
      title: "Transport Layer Reliability & Congestion Control",
      description: "TCP ensures end-to-end reliability through sequence numbers, positive acknowledgments (ACKs), and retransmission timers. It uses sliding window flow control to prevent overwhelming the receiver and slow-start congestion control algorithms to prevent saturating intermediate network links.",
    },
  ],
  examTips: [
    "Remember the exact order of encapsulation: Data → Segment (Transport) → Packet (Network) → Frame (Data Link) → Bits (Physical).",
    "Be prepared to calculate network and broadcast addresses given a CIDR notation like 192.168.1.0/26 (block size of 64).",
    "Differentiate clearly between flow control (protecting the receiving host buffer) and congestion control (protecting the intermediate network routers).",
  ],
};
