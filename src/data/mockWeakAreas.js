export const mockWeakAreas = [
  {
    id: "weak-1",
    topic: "Subnet Mask Calculations & CIDR",
    masteryPercent: 28,
    relatedQuizzes: 4,
    lastReviewed: null,
    explanation:
      "Subnetting partitions network addresses into sub-networks using Classless Inter-Domain Routing (CIDR). Mastery requires calculating network IDs, broadcast addresses, and usable host ranges from prefix lengths like /26 or /28.",
    keyTips: [
      "Formula for hosts: 2^(32 - prefix) - 2 usable IP addresses.",
      "The broadcast address is always the last IP address in the subnet block.",
    ],
  },
  {
    id: "weak-2",
    topic: "TCP 3-Way Handshake & Teardown",
    masteryPercent: 35,
    relatedQuizzes: 3,
    lastReviewed: "2 days ago",
    explanation:
      "Connection establishment relies on SYN, SYN-ACK, and ACK packet sequence exchanges. Struggles often occur when distinguishing sequence/acknowledgment number offsets during connection setup vs FIN/ACK connection teardowns.",
    keyTips: [
      "SYN consumes 1 sequence number during initialization.",
      "FIN packet initiates connection termination from either client or server.",
    ],
  },
  {
    id: "weak-3",
    topic: "OSI Model vs TCP/IP Layer Encapsulation",
    masteryPercent: 42,
    relatedQuizzes: 3,
    lastReviewed: "Yesterday",
    explanation:
      "Encapsulation wraps protocol data units (PDUs) with headers at each layer. Confusion typically arises when mapping OSI 7 layers (Application down to Physical) to the 4-layer TCP/IP conceptual model.",
    keyTips: [
      "Layer 4 (Transport) PDU is a Segment; Layer 3 (Network) PDU is a Packet.",
      "Switches operate primarily at Layer 2 (Data Link); Routers operate at Layer 3.",
    ],
  },
  {
    id: "weak-4",
    topic: "DNS Recursive vs Iterative Resolution",
    masteryPercent: 48,
    relatedQuizzes: 2,
    lastReviewed: "5 days ago",
    explanation:
      "Domain Name System (DNS) maps domain names to IP addresses. Recursive queries put the burden on the resolver to return the final answer, whereas iterative queries return referral pointers to root, TLD, and authoritative name servers.",
    keyTips: [
      "Recursive resolvers query other servers on behalf of the client.",
      "Root servers (. dot) direct queries to TLD servers (.com, .org).",
    ],
  },
  {
    id: "weak-5",
    topic: "TCP Flow Control vs Congestion Control",
    masteryPercent: 54,
    relatedQuizzes: 2,
    lastReviewed: "3 days ago",
    explanation:
      "Flow control prevents a fast sender from overwhelming a slow receiver (using sliding receiver window size). Congestion control prevents senders from overwhelming the network infrastructure (using slow-start, congestion window, and AIMD).",
    keyTips: [
      "Flow control = Receiver buffer protection.",
      "Congestion control = Network pipe bandwidth protection.",
    ],
  },
];
