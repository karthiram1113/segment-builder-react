import React, { useState, useMemo, useCallback } from 'react';
import './index.css'; // You'll need a basic CSS file for styling

// --- Schema Definitions ---
const allSchemas = [
    { label: 'First Name', value: 'first_name', trait: 'User Traits' },
    { label: 'Last Name', value: 'last_name', trait: 'User Traits' },
    { label: 'Gender', value: 'gender', trait: 'User Traits' },
    { label: 'Age', value: 'age', trait: 'User Traits' },
    { label: 'Account Name', value: 'account_name', trait: 'Group Traits' },
    { label: 'City', value: 'city', trait: 'User Traits' },
    { label: 'State', value: 'state', trait: 'User Traits' },
];

// --- SegmentModal Component ---
const SegmentModal = ({ isVisible, onClose, onSave }) => {
    const [segmentName, setSegmentName] = useState('');
    const [selectedSchemas, setSelectedSchemas] = useState([]);
    const [currentSchemaToAdd, setCurrentSchemaToAdd] = useState('');

    // 1. Determine available options for the "Add schema to segment" dropdown
    const availableOptions = useMemo(() => {
        const selectedValues = new Set(selectedSchemas.map(s => s.value));
        return allSchemas.filter(schema => !selectedValues.has(schema.value));
    }, [selectedSchemas]);

    // 2. Handler for adding a new schema from the dropdown
    const handleAddNewSchema = useCallback(() => {
        if (currentSchemaToAdd) {
            const schemaToAdd = allSchemas.find(s => s.value === currentSchemaToAdd);
            if (schemaToAdd) {
                // Add the selected schema to the list
                setSelectedSchemas(prev => [...prev, schemaToAdd]);

                // Reset the "Add schema to segment" dropdown (Requirement 8)
                setCurrentSchemaToAdd('');
            }
        }
    }, [currentSchemaToAdd]);

    // 3. Handler for removing a selected schema
    const handleRemoveSchema = useCallback((valueToRemove) => {
        setSelectedSchemas(prev => prev.filter(s => s.value !== valueToRemove));
    }, []);

    // 4. Handler for changing a schema in the blue box (Requirement 7)
    const handleChangeSelectedSchema = useCallback((oldValue, newValue) => {
        const newSchema = allSchemas.find(s => s.value === newValue);
        if (newSchema) {
            setSelectedSchemas(prev =>
                prev.map(s => (s.value === oldValue ? newSchema : s))
            );
        }
    }, []);

    // 5. Handler for the final Save action (Requirement 9)
    const handleSaveSegment = useCallback(() => {
        const payload = {
            segment_name: segmentName,
            schema: selectedSchemas.map(s => ({ [s.value]: s.label }))
        };

        // Log the data and send it to the parent handler
        console.log('Saving Segment Data:', payload);
        onSave(payload);

        // Close and reset state
        setSegmentName('');
        setSelectedSchemas([]);
        setCurrentSchemaToAdd('');
        onClose();
    }, [segmentName, selectedSchemas, onClose, onSave]);

    if (!isVisible) {
        return null;
    }

    // Determine available options for modification inside the blue box
    const getDynamicOptions = (currentValue) => {
        const selectedValues = new Set(selectedSchemas.map(s => s.value));
        return allSchemas.filter(schema =>
            !selectedValues.has(schema.value) || schema.value === currentValue
        );
    };

    // Custom styled dropdown for schema selection
    const SchemaDropdown = ({ schema, onChange, onRemove, allPossibleOptions }) => {
        const isGroupTrait = schema.trait === 'Group Traits';
        const indicatorStyle = {
            backgroundColor: isGroupTrait ? 'red' : 'green',
            borderRadius: '50%',
            width: '8px',
            height: '8px',
            display: 'inline-block',
            marginRight: '8px'
        };

        return (
            <div className="schema-row">
                <div style={indicatorStyle}></div>
                <select
                    className="schema-select"
                    value={schema.value}
                    onChange={(e) => onChange(schema.value, e.target.value)}
                >
                    {allPossibleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button className="remove-btn" onClick={() => onRemove(schema.value)}>-</button>
            </div>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Saving Segment</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <label>Enter the Name of the Segment</label>
                    <input
                        type="text"
                        placeholder="Name of the segment"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        className="segment-input"
                    />

                    <p className="schema-info">
                        To save your segment, you need to add the schemas to build the query
                        <span style={{ float: 'right', fontSize: '12px' }}>
                            <span style={{ color: 'green', marginRight: '5px' }}>● User Traits</span>
                            <span style={{ color: 'red' }}>● Group Traits</span>
                        </span>
                    </p>

                    {/* Blue Box for Selected Schemas */}
                    <div className="selected-schemas-box">
                        {selectedSchemas.map((schema, index) => (
                            <SchemaDropdown
                                key={schema.value}
                                schema={schema}
                                onChange={handleChangeSelectedSchema}
                                onRemove={handleRemoveSchema}
                                allPossibleOptions={getDynamicOptions(schema.value)}
                            />
                        ))}

                        {/* Dropdown for adding new schemas */}
                        <div className="schema-row-add">
                            <div style={{ backgroundColor: '#ccc', borderRadius: '50%', width: '8px', height: '8px', display: 'inline-block', marginRight: '8px' }}></div>
                            <select
                                value={currentSchemaToAdd}
                                onChange={(e) => setCurrentSchemaToAdd(e.target.value)}
                                className="schema-select"
                            >
                                <option value="" disabled>Add schema to segment</option>
                                {availableOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="remove-btn-placeholder">-</div>
                        </div>

                        {/* +Add new schema link (Requirement 5) */}
                        <button
                            className="add-schema-link"
                            onClick={handleAddNewSchema}
                            disabled={!currentSchemaToAdd}
                        >
                            + Add new schema
                        </button>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="save-btn"
                        onClick={handleSaveSegment}
                        disabled={!segmentName || selectedSchemas.length === 0}
                    >
                        Save the Segment
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SegmentModal;