import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../Dashboard.css"; // We'll create this file separately

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const [schemaData, setSchemaData] = useState([]);
  const [doorOpen, setDoorOpen] = useState(false);

  useEffect(() => {
    async function fetchSchemaData() {
      const response = await fetch("http://localhost:8080/doorschema");
      const data = await response.json();
      if (response.status !== 200) {
        console.log("Failed to fetch schema data");
        return;
      }
      console.log("Schema data:", data);
      setSchemaData(data);
    }

    fetchSchemaData();
  }, []);

  const handleRemoveUser = (userId) => {
    // Update the roomAccessData state by filtering out the removed user
    setRoomAccessData((prevData) => ({
      ...prevData,
      users: prevData.users.filter((user) => user.id !== userId),
    }));

    // In a real app, you would also make an API call to persist this change
    console.log(
      `User with ID ${userId} removed from ${roomAccessData.roomNumber}`
    );
  };
  // Sample data - in a real app this would come from an API
  useEffect(() => {}, []);
  const [entryLogs, setEntryLogs] = useState([
    {
      id: 1,
      timestamp: "2021-04-12 08:32:15",
      rfid: "A7F3B209",
      userName: "John Smith",
      roomNumber: "Room 101",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2019-04-12 09:15:42",
      rfid: "B8D4C310",
      userName: "Emily Johnson",
      roomNumber: "Room 203",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2025-04-12 10:07:31",
      rfid: "C9E5D421",
      userName: "Michael Brown",
      roomNumber: "Room 302",
      status: "success",
    },
    {
      id: 4,
      timestamp: "2015-04-12 11:23:09",
      rfid: "D0F6E532",
      userName: "Jessica Davis",
      roomNumber: "Room 101",
      status: "denied",
    },
    {
      id: 5,
      timestamp: "1999-04-12 12:48:57",
      rfid: "E1G7F643",
      userName: "David Wilson",
      roomNumber: "Room 302",
      status: "success",
    },
    {
      id: 6,
      timestamp: "2025-04-12 13:54:26",
      rfid: "F2H8G754",
      userName: "Sarah Martinez",
      roomNumber: "Room 203",
      status: "success",
    },
    {
      id: 7,
      timestamp: "2025-04-12 14:37:18",
      rfid: "G3I9H865",
      userName: "Kevin Taylor",
      roomNumber: "Room 102",
      status: "denied",
    },
    {
      id: 8,
      timestamp: "2025-04-12 15:19:34",
      rfid: "H4J0I976",
      userName: "Amanda Anderson",
      roomNumber: "Room 201",
      status: "success",
    },
    {
      id: 9,
      timestamp: "2025-04-12 10:07:31",
      rfid: "C9E5D421",
      userName: "Michael Brown",
      roomNumber: "Room 302",
      status: "success",
    },
    {
      id: 10,
      timestamp: "2015-04-12 11:23:09",
      rfid: "D0F6E532",
      userName: "Jessica Davis",
      roomNumber: "Room 101",
      status: "denied",
    },
    {
      id: 11,
      timestamp: "1999-04-12 12:48:57",
      rfid: "E1G7F643",
      userName: "David Wilson",
      roomNumber: "Room 302",
      status: "success",
    },
    {
      id: 12,
      timestamp: "2025-04-12 13:54:26",
      rfid: "F2H8G754",
      userName: "Sarah Martinez",
      roomNumber: "Room 203",
      status: "success",
    },
    {
      id: 14,
      timestamp: "2025-04-12 14:37:18",
      rfid: "G3I9H865",
      userName: "Kevin Taylor",
      roomNumber: "Room 102",
      status: "denied",
    },
    {
      id: 15,
      timestamp: "2025-04-12 15:19:34",
      rfid: "H4J0I976",
      userName: "Amanda Anderson",
      roomNumber: "Room 201",
      status: "success",
    },
  ]);

  const [roomAccessData, setRoomAccessData] = useState({
    roomNumber: "Room 101",
    users: [
      { id: 1, userName: "John Smith", rfid: "A7F3B209" },
      { id: 4, userName: "Jessica Davis", rfid: "D0F6E532" },
      { id: 16, userName: "Robert Chen", rfid: "J6L2K198" },
      { id: 17, userName: "Patricia Lee", rfid: "K7M3L209" },
    ],
  });

  // Filter logs based on search term, filter option, and date range
  const filteredLogs = entryLogs.filter((log) => {
    // Search term filter
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rfid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterOption === "all" || log.status === filterOption;

    // Date filter
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set end date to end of day
      matchesDate = logDate >= startDate && logDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    navigate("/login");
  };
  const toggleDoor = () => {
    setDoorOpen(true); // Add new log entry for the door open action
    const newEntry = {
      id: entryLogs.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      rfid: "ADMIN_OVERRIDE",
      userName: "Admin User",
      roomNumber: roomAccessData.roomNumber,
      status: "success",
    };
    setEntryLogs((prev) => [newEntry, ...prev]); // Automatically close the door after 3 seconds
    setTimeout(() => {
      setDoorOpen(false);
    }, 3000);
  };

  // Simulated real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new entry every 30 seconds
      if (Math.random() > 0.5) {
        const newEntry = {
          id: entryLogs.length + 1,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
          rfid: `R${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          userName: ["Alex Wong", "Maria Garcia", "James Johnson", "Lisa Chen"][
            Math.floor(Math.random() * 4)
          ],
          roomNumber: `Room ${Math.floor(Math.random() * 3 + 1)}0${Math.floor(
            Math.random() * 3 + 1
          )}`,
          status: Math.random() > 0.8 ? "denied" : "success",
        };
        setEntryLogs((prev) => [newEntry, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Background gradient */}
      <div className="site-background"></div>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="dashboard-logo" style={{ marginBottom: "20px" }}>
            <div
              style={{
                width: "160px",
                height: "160px",

                borderRadius: "50%",
                backgroundImage: "url('/public/KeylessCampus.png')",
                backgroundSize: "80%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#efdfc2",
              }}
            ></div>
          </div>

          <nav className="dashboard-nav">
            <ul>
              <li
                className={activeTab === "history" ? "active" : ""}
                onClick={() => setActiveTab("history")}
              >
                Door History
              </li>
              <li
                className={activeTab === "roomAccess" ? "active" : ""}
                onClick={() => setActiveTab("roomAccess")}
              >
                Room Access
              </li>
              <li
                className={activeTab === "doorControl" ? "active" : ""}
                onClick={() => setActiveTab("doorControl")}
              >
                Door Control
              </li>
              {/*
              <li
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                Manage Users
              </li>
              <li
                className={activeTab === "rooms" ? "active" : ""}
                onClick={() => setActiveTab("rooms")}
              >
                Room Access
              </li>
              <li
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </li> */}
            </ul>
          </nav>

          <div className="dashboard-logout" onClick={handleLogout}>
            Logout
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === "history" && (
            <>
              <div className="dashboard-header">
                <h1>Door History</h1>
                <div className="user-info">
                  <span>Admin User</span>
                  <div className="user-avatar">AU</div>
                </div>
              </div>

              <div className="dashboard-filters">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by name, RFID or room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-options">
                  <select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    className="select-dropdown"
                  >
                    <option value="all">All Entries</option>
                    <option value="success">Successful</option>
                    <option value="denied">Access Denied</option>
                  </select>

                  <input
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    placeholder="End Date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="entry-log-table">
                <div className="table-header">
                  <div className="header-timestamp">Timestamp</div>
                  <div className="header-rfid">RFID</div>
                  <div className="header-user">User Name</div>
                  <div className="header-room">Room</div>
                  <div className="header-status">Status</div>
                </div>

                <div className="table-body">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <div key={log.id} className="table-row">
                        <div className="cell-timestamp">{log.timestamp}</div>
                        <div className="cell-rfid">{log.rfid}</div>
                        <div className="cell-user">{log.userName}</div>
                        <div className="cell-room">{log.roomNumber}</div>
                        <div className={`cell-status ${log.status}`}>
                          {log.status === "success" ? "Granted" : "Denied"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      No entries found matching your filters
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {activeTab === "roomAccess" && (
            <>
              <div className="dashboard-header">
                <h1>Room Access Management</h1>
                <div className="user-info">
                  <span>Admin User</span>
                  <div className="user-avatar">AU</div>
                </div>
              </div>

              <div className="room-access-container">
                <div className="room-access-section">
                  <h2>{roomAccessData.roomNumber}</h2>
                  <div className="room-users-table">
                    <div className="table-header">
                      <div className="header-user">User Name</div>
                      <div className="header-rfid">RFID</div>
                      <div className="header-actions">Actions</div>
                    </div>
                    <div className="table-body">
                      {schemaData.length > 0 ? (
                        schemaData.map((user) => (
                          <div key={user.id} className="table-row">
                            <div className="cell-user">{user.username}</div>
                            <div className="cell-rfid">{user.RFID}</div>
                            <div className="cell-actions">
                              <button
                                className="action-btn remove"
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">
                          No users found for this room
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "doorControl" && (
            <>
              <div className="dashboard-header">
                <h1>Door Control</h1>
                <div className="user-info">
                  <span>Admin User</span>
                  <div className="user-avatar">AU</div>
                </div>
              </div>

              <div className="door-control-container">
                <div className="door-simulation">
                  <div className="door-frame">
                    <div className={`door ${doorOpen ? "open" : ""}`}>
                      <div className="door-handle"></div>
                    </div>
                  </div>
                  <div className="door-status">
                    Door is {doorOpen ? "Open" : "Closed"}
                  </div>
                </div>

                <div className="door-controls">
                  <button
                    className={`door-control-btn ${
                      doorOpen ? "disabled" : "active"
                    }`}
                    onClick={toggleDoor}
                    disabled={doorOpen}
                  >
                    {doorOpen ? "Opening..." : "Open Door"}
                  </button>
                </div>
              </div>
            </>
          )}
          {/* 
          <div className="pagination">
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">Next</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
