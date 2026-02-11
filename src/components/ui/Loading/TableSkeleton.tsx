
import React from 'react';

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
    return (
        <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4" /> {/* Header */}
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-4">
                    {[...Array(columns)].map((_, j) => (
                        <div key={j} className="h-8 bg-gray-100 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};
