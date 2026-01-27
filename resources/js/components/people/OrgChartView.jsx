import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Stack,
    Divider
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

export default function OrgChartView({ data }) {
    if (!data) return null;

    const renderNode = (node, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;

        return (
            <Box key={node.id} sx={{ ml: level === 0 ? 0 : 5, position: 'relative' }}>
                {/* Connection line for children */}
                {level > 0 && (
                    <Box sx={{
                        position: 'absolute',
                        left: -25,
                        top: 25,
                        width: 25,
                        height: 2,
                        bgcolor: '#e2e8f0'
                    }} />
                )}
                {/* Vertical line for group of siblings */}
                {level > 0 && (
                    <Box sx={{
                        position: 'absolute',
                        left: -25,
                        top: -10,
                        width: 2,
                        height: 'calc(100% + 20px)',
                        bgcolor: '#e2e8f0'
                    }} />
                )}

                <Paper sx={{
                    p: 2,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: 'fit-content',
                    minWidth: 300,
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f5f9'
                }}>
                    <Avatar
                        src={node.photo_url || '/default-avatar.png'}
                        alt={node.name}
                        sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {node.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {node.job_title}
                        </Typography>
                        {node.direct_reports_count > 0 && (
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.disabled', fontWeight: 600 }}>
                                {node.direct_reports_count} direct report{node.direct_reports_count !== 1 ? 's' : ''}
                            </Typography>
                        )}
                    </Box>
                </Paper>

                {hasChildren && (
                    <Box sx={{ mt: 0 }}>
                        {node.children.map(child => renderNode(child, level + 1))}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header removed as it is now in PeoplePage */}

            <Box sx={{ mt: 6, pl: 2 }}>
                {renderNode(data)}
            </Box>

            <Box sx={{ mt: 8, p: 3, bgcolor: '#f1f5f9', borderRadius: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> This is a simplified hierarchical view. A full interactive org chart with zoom/pan capabilities will be added in a future update.
                </Typography>
            </Box>
        </Box>
    );
}
