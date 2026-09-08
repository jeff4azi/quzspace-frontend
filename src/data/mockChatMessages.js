export const mockChatMessages = [
  {
    id: "msg-1",
    role: "user",
    content: "Can you explain how a TCP 3-way handshake works in simple terms?",
    timestamp: "10:14 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "Sure! Think of a TCP 3-way handshake like setting up a phone call:\n\n1. **SYN (Synchronize)**: The client asks, 'Can we talk? Here is my initial sequence number.'\n2. **SYN-ACK**: The server responds, 'Yes! I acknowledge your request and here is my sequence number.'\n3. **ACK (Acknowledge)**: The client confirms, 'Got it, let's start sending data.'\n\nOnce complete, a reliable, full-duplex connection is established!",
    timestamp: "10:14 AM",
  },
  {
    id: "msg-3",
    role: "user",
    content: "Why is subnetting important for router performance?",
    timestamp: "10:16 AM",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: "Subnetting partitions a large network into smaller logical sub-networks. This improves router performance in two key ways:\n\n• **Reduces Broadcast Traffic**: Broadcast messages stay contained within the local subnet rather than flooding the entire network.\n• **Optimizes Routing Tables**: Routers use aggregated CIDR prefix routing to keep routing tables smaller and packet forwarding significantly faster.",
    timestamp: "10:16 AM",
  },
  {
    id: "msg-5",
    role: "user",
    content: "What topics should I focus on for the upcoming Computer Networks final exam?",
    timestamp: "10:18 AM",
  },
  {
    id: "msg-6",
    role: "assistant",
    content: "Based on your 8 uploaded files, here are the top 3 high-yield exam topics:\n\n1. **OSI vs TCP/IP Layer Encapsulation**: Know the exact order of data units (Bits → Frames → Packets → Segments → Data).\n2. **Subnet Mask Calculations**: Practice subnetting CIDR notations like /26 or /28.\n3. **Flow Control vs Congestion Control**: Understand sliding window buffers vs TCP slow-start algorithms.",
    timestamp: "10:18 AM",
  },
];

export const mockSuggestedPrompts = [
  "Explain TCP 3-way handshake in simple terms",
  "How do CIDR subnet calculations work?",
  "What are the key exam topics for this course?",
  "What is the difference between TCP and UDP?",
];

export const cannedResponses = [
  "Great question! Based on your uploaded materials, that concept relates directly to Layer 3 and Layer 4 protocol interactions. Would you like me to generate a practice quiz question on this topic?",
  "I've analyzed your notes on that topic. In summary, it ensures data integrity and prevents network bottlenecks. Let me know if you want a step-by-step diagram explanation!",
  "That is a core topic for your upcoming exam! Remember to pay attention to sequence numbers and buffer limits when reviewing that chapter.",
];
