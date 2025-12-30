[
  {"course":"ros2","question":"What was the first sign of the ROS 2 communication problem?","answer":"Only /rosout and /parameter_events were visible.","reasoning":"This indicates node discovery is failing."},

  {"course":"ros2","question":"What command revealed the missing ROS 2 topics?","answer":"ros2 topic list","reasoning":"It shows all topics visible to the current node."},

  {"course":"ros2","question":"What does seeing only /rosout usually mean in ROS 2?","answer":"Discovery is not working.","reasoning":"Nodes cannot see each other without discovery."},

  {"course":"ros2","question":"Which ROS 2 distribution was in use?","answer":"ROS 2 Jazzy","reasoning":"Different distros have different discovery defaults."},

  {"course":"ros2","question":"Which two machines needed to communicate?","answer":"Ubuntu desktop and Raspberry Pi","reasoning":"ROS 2 nodes must be on the same network domain."},

  {"course":"ros2","question":"Why does ROS 2 rely on multicast by default?","answer":"For automatic node discovery.","reasoning":"DDS uses multicast to find peers."},

  {"course":"ros2","question":"What common network issue blocks ROS 2 discovery?","answer":"Firewall blocking multicast or UDP traffic.","reasoning":"DDS requires open UDP ports."},

  {"course":"ros2","question":"What firewall caused the communication failure?","answer":"Ubuntu firewall (ufw).","reasoning":"It blocked DDS discovery traffic."},

  {"course":"ros2","question":"What fixed the ROS 2 visibility issue immediately?","answer":"Disabling or configuring the firewall.","reasoning":"It allowed DDS traffic through."},

  {"course":"ros2","question":"What ROS 2 warning hinted at discovery configuration?","answer":"ROS_LOCALHOST_ONLY is deprecated warning.","reasoning":"It pointed to discovery range settings."},

  {"course":"ros2","question":"What replaced ROS_LOCALHOST_ONLY in newer ROS 2?","answer":"ROS_AUTOMATIC_DISCOVERY_RANGE and ROS_STATIC_PEERS.","reasoning":"They provide finer discovery control."},

  {"course":"ros2","question":"Why was static peer discovery introduced?","answer":"To work on networks without multicast.","reasoning":"Static peers use direct IP discovery."},

  {"course":"ros2","question":"What DDS implementation was forced for reliability?","answer":"CycloneDDS","reasoning":"It works well with static peers."},

  {"course":"ros2","question":"What environment variable defines ROS domain separation?","answer":"ROS_DOMAIN_ID","reasoning":"Nodes must share the same domain."},

  {"course":"ros2","question":"Why must ROS_DOMAIN_ID match on all machines?","answer":"Otherwise nodes cannot see each other.","reasoning":"Domains isolate ROS graphs."},

  {"course":"ros2","question":"What IP range were the machines using?","answer":"10.0.0.x LAN","reasoning":"They were on the same subnet."},

  {"course":"ros2","question":"Why did ros2 node list initially show duplicates?","answer":"Multiple nodes shared the same name.","reasoning":"Duplicate names can cause conflicts."},

  {"course":"ros2","question":"What tool confirmed rosbridge was running?","answer":"ros2 node list","reasoning":"It showed rosbridge_websocket and rosapi."},

  {"course":"ros2","question":"What port was rosbridge_websocket launched on?","answer":"9091","reasoning":"This port was exposed for WebSocket clients."},

  {"course":"ros2","question":"Why was rosbridge used instead of native ROS nodes?","answer":"To connect web-based and remote clients.","reasoning":"rosbridge enables JSON-over-WebSocket."},

  {"course":"ros2","question":"What command launched rosbridge?","answer":"ros2 launch rosbridge_server rosbridge_websocket_launch.xml","reasoning":"It starts the WebSocket bridge."},

  {"course":"ros2","question":"Why did the Raspberry Pi not see topics at first?","answer":"Network discovery was blocked.","reasoning":"DDS traffic never reached it."},

  {"course":"ros2","question":"What confirmed the network itself was working?","answer":"Ping between machines succeeded.","reasoning":"Basic connectivity was fine."},

  {"course":"ros2","question":"Why is ping not enough to verify ROS 2 connectivity?","answer":"ROS 2 requires UDP multicast.","reasoning":"Ping only tests ICMP."},

  {"course":"ros2","question":"What solved discovery without multicast?","answer":"Static peer configuration.","reasoning":"Peers connect directly by IP."},

  {"course":"ros2","question":"Why was a one-time setup script created?","answer":"To standardize fixes across machines.","reasoning":"Manual steps are error-prone."},

  {"course":"ros2","question":"What shell script feature ensured reliability?","answer":"set -euo pipefail","reasoning":"It stops on errors and undefined vars."},

  {"course":"ros2","question":"Why must terminals be restarted after env changes?","answer":"Environment variables load at shell startup.","reasoning":"Old shells keep old values."},

  {"course":"ros2","question":"What confirmed success after the fix?","answer":"Topics and nodes became visible.","reasoning":"Discovery was restored."},

  {"course":"ros2","question":"What ROS command verified node visibility?","answer":"ros2 node list","reasoning":"It shows active nodes."},

  {"course":"ros2","question":"What ROS command verified topic visibility?","answer":"ros2 topic list","reasoning":"It shows active topics."},

  {"course":"ros2","question":"Why is firewall configuration preferred over disabling it?","answer":"For security.","reasoning":"ROS 2 should not expose all ports."},

  {"course":"ros2","question":"Which protocol does DDS primarily use?","answer":"UDP","reasoning":"It enables fast real-time communication."},

  {"course":"ros2","question":"Why is UDP harder for firewalls than TCP?","answer":"It uses dynamic ports.","reasoning":"Firewalls struggle with DDS traffic."},

  {"course":"ros2","question":"What role did the Raspberry Pi play?","answer":"Remote ROS 2 node host.","reasoning":"It needed to subscribe and publish."},

  {"course":"ros2","question":"Why was Jazzy sensitive to network config?","answer":"It enforces newer DDS policies.","reasoning":"Defaults are stricter."},

  {"course":"ros2","question":"What lesson was learned about ROS 2 networking?","answer":"Discovery issues are usually network-related.","reasoning":"Code is rarely the root cause."},

  {"course":"ros2","question":"Why is static discovery ideal for robots?","answer":"Robots often run on restricted networks.","reasoning":"Multicast is unreliable in production."},

  {"course":"ros2","question":"What was the final confirmed root cause?","answer":"Ubuntu firewall blocking DDS traffic.","reasoning":"Once removed, everything worked."},

  {"course":"ros2","question":"What best practice emerged from this session?","answer":"Always verify network and firewall first.","reasoning":"It saves hours of debugging."},

  {"course":"ros2","question":"What key ROS 2 concept was reinforced?","answer":"DDS discovery underpins all communication.","reasoning":"Without it, ROS appears broken."},

  {"course":"ros2","question":"Why is documenting this process important?","answer":"It prevents repeating the same issue.","reasoning":"ROS networking problems recur often."}
]