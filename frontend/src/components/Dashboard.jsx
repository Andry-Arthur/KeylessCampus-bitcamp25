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
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </li>
              {/* <li
                className={activeTab === "history" ? "active" : ""}
                onClick={() => setActiveTab("history")}
              >
                Entry History
              </li>
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
          <div className="dashboard-header">
            <h1>Entry History</h1>
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
