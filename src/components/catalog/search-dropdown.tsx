import React from "react";
import {Box, Link} from "@mui/material";
import {SearchResult, SearchResultType} from "../../api";
import {Segment} from "@mui/icons-material";

export const SearchResultsDropdown: React.FC<{ results: SearchResult[] }> = ({ results }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: '8px',
                marginTop: '8px',
                width: '100%',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '16px',
            }}
        >
            {results.map((result, index) => (
                <Box key={`${result.type}_${result.data.id}`}>
                    <Link
                        href={result.type === SearchResultType.GOOD ? `/goods/${result.data.id}` : `/catalog/${result.data.id}`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            color: 'black',
                            textDecoration: 'none',
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            borderRadius: '4px',
                        }}
                    >
                        <Box sx={{ marginRight: '12px' }}>
                            {'goodImages' in result.data ? (
                                <img src={`http://localhost:8080/files/images/${result.data.goodImages[0]?.image}`} alt={result.data.name} style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                            ) : (
                                <Segment style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                            )}
                        </Box>
                        <Box>
                            <Box sx={{ fontSize: '14px', fontWeight: '500' }}>{result.data.name}</Box>
                            {'price' in result.data && (
                                <Box sx={{ fontSize: '12px', color: 'gray' }}>{result.data.price} ₽</Box>
                            )}
                        </Box>
                    </Link>
                    {index < results.length - 1 && (
                        <Box sx={{ borderBottom: '1px solid #e0e0e0', margin: '8px 0' }} />
                    )}
                </Box>
            ))}
        </Box>
    );
};