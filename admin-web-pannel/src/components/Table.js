import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiFilter, FiSearch } from "react-icons/fi";

const Table = ({
  headers,
  data,
  onRowClick,
  sortable = true,
  searchable = true,
  selectable = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSelectRow = (rowIndex, event) => {
    event.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="modern-table-container">
      {searchable && (
        <div className="table-search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>
      )}

      <div className="table-scroll-container">
        <table className="modern-data-table">
          <thead>
            <tr>
              {selectable && <th className="select-column"></th>}
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => sortable && handleSort(header.key || header)}
                  className={sortable ? "sortable-header" : ""}
                >
                  <div className="header-content">
                    {header.label || header}
                    {sortable && sortConfig.key === (header.key || header) && (
                      <span className="sort-icon">
                        {sortConfig.direction === "asc" ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </span>
                    )}
                    {sortable && sortConfig.key !== (header.key || header) && (
                      <span className="filter-icon">
                        <FiFilter />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={`table-row ${
                  selectedRows.includes(rowIndex) ? "selected-row" : ""
                } ${onRowClick ? "clickable-row" : ""}`}
              >
                {selectable && (
                  <td className="select-cell">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={(e) => handleSelectRow(rowIndex, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    data-label={headers[cellIndex]?.label || headers[cellIndex]}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="table-info">
          Showing {filteredData.length} of {data.length} entries
        </div>
        <div className="table-pagination">
          <button className="pagination-button disabled">Previous</button>
          <span className="pagination-page">1</span>
          <button className="pagination-button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
