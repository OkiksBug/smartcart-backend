import React, { useState } from 'react';
import { Button } from '../common';

export default function AssignStaffModal({ isOpen, onClose, orderId, onAssign }) {
    const [selectedStaff, setSelectedStaff] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAssign) {
            onAssign(orderId, selectedStaff);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Assign Staff</h2>
                <form onSubmit={handleSubmit}>
                    <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        required
                    >
                        <option value="">Select Staff Member</option>
                        {/* Add staff options here */}
                    </select>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-blue-500 text-white">Assign</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
