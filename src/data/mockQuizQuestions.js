export const mockQuizQuestions = [
  {
    id: "q-1",
    question: "What is the primary function of the 3-way handshake in TCP connection setup?",
    options: [
      "To encrypt all transmitted payload packets",
      "To synchronize sequence numbers and establish a reliable full-duplex session",
      "To compress data headers before transmission over routers",
      "To allocate static IP addresses to client interfaces",
    ],
    correctAnswerIndex: 1,
    topic: "TCP 3-Way Handshake",
    explanation:
      "The TCP 3-way handshake (SYN, SYN-ACK, ACK) synchronizes initial sequence numbers (ISNs) between client and server to establish a reliable, full-duplex connection before data transmission begins.",
  },
  {
    id: "q-2",
    question: "In CIDR notation /26, how many usable host IP addresses are available on the subnet?",
    options: ["64 usable hosts", "62 usable hosts", "32 usable hosts", "30 usable hosts"],
    correctAnswerIndex: 1,
    topic: "Subnet Mask Calculations",
    explanation:
      "A /26 subnet leaves 6 bits for hosts (32 - 26 = 6). 2^6 = 64 total IP addresses. Subtracting 2 reserved addresses (network ID and broadcast ID) leaves 62 usable host IPs.",
  },
  {
    id: "q-3",
    question: "Which Layer of the OSI model is responsible for packet routing across multiple networks?",
    options: ["Layer 2 - Data Link Layer", "Layer 3 - Network Layer", "Layer 4 - Transport Layer", "Layer 7 - Application Layer"],
    correctAnswerIndex: 1,
    topic: "OSI Model Layers",
    explanation:
      "Layer 3 (Network Layer) handles logical IP addressing and packet routing across interconnected networks using protocols such as IPv4 and IPv6.",
  },
  {
    id: "q-4",
    question: "What type of DNS query forces the DNS server to return the final IP address or an error, rather than a referral pointer?",
    options: ["Iterative query", "Recursive query", "Reverse lookup query", "Authoritative query"],
    correctAnswerIndex: 1,
    topic: "DNS Resolution",
    explanation:
      "In a recursive DNS query, the client requests that the DNS resolver perform all necessary queries on its behalf and return either the final IP address or a failure error.",
  },
  {
    id: "q-5",
    question: "What mechanism does TCP Flow Control use to prevent a fast sender from overwhelming a slow receiver?",
    options: ["AIMD Congestion Window", "Sliding Receiver Window (rwnd)", "Slow Start Threshold (ssthresh)", "Fast Retransmit Timer"],
    correctAnswerIndex: 1,
    topic: "Flow Control vs Congestion Control",
    explanation:
      "TCP Flow Control uses the Advertised Receiver Window (rwnd) size contained in TCP header acknowledgments to throttle the sender based on available receiver buffer space.",
  },
  {
    id: "q-6",
    question: "Which transport layer protocol provides connectionless, unacknowledged data delivery with minimum overhead?",
    options: ["TCP", "UDP", "ICMP", "BGP"],
    correctAnswerIndex: 1,
    topic: "Transport Protocols",
    explanation:
      "UDP (User Datagram Protocol) is a lightweight, connectionless protocol that transmits datagrams without setup handshakes, sequence numbers, or delivery acknowledgments.",
  },
  {
    id: "q-7",
    question: "What PDU (Protocol Data Unit) is created at Layer 4 (Transport) when data is encapsulated?",
    options: ["Frame", "Packet", "Segment", "Bit stream"],
    correctAnswerIndex: 2,
    topic: "OSI Encapsulation",
    explanation:
      "At Layer 4 (Transport), application data is divided and wrapped with transport headers (port numbers, sequence numbers) to form a Segment (or Datagram for UDP).",
  },
  {
    id: "q-8",
    question: "Which algorithm is used by TCP Congestion Control during initial connection startup to probe available bandwidth?",
    options: ["Fast Recovery", "Slow Start", "Congestion Avoidance", "Selective Acknowledgment"],
    correctAnswerIndex: 1,
    topic: "Congestion Control",
    explanation:
      "TCP Slow Start exponentially doubles the congestion window (cwnd) every RTT starting from 1 MSS until it reaches the slow-start threshold (ssthresh) or packet loss occurs.",
  },
];

export const getQuizDetailsById = (quizId) => {
  return {
    id: quizId || "quiz-1",
    title: "Computer Networks Midterm Prep",
    questionCount: mockQuizQuestions.length,
    timeEstimate: "10 mins",
    subject: "Computer Networks",
  };
};
