import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';

/**
 * MentionTextarea
 * A textarea that shows a user dropdown when the user types "@".
 *
 * Props:
 *  - value: string (controlled)
 *  - onChange: (newValue: string) => void
 *  - users: Array<{ id: number|string, name: string }>
 *  - placeholder: string
 *  - rows: number
 *  - className: string
 */
export default function MentionTextarea({ value, onChange, users = [], placeholder, rows = 3, className = '' }) {
    const textareaRef = useRef(null);
    const dropdownRef = useRef(null);

    const [mentionState, setMentionState] = useState({
        active: false,   // is dropdown open?
        query: '',       // text typed after @
        startIndex: -1,  // position of the @ in the value
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filtered user list based on query
    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(mentionState.query.toLowerCase())
    ).slice(0, 8);

    // When the user types, detect "@" trigger
    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        onChange(newValue);

        const cursor = e.target.selectionStart;
        // Walk back from cursor to find "@"
        const textBeforeCursor = newValue.slice(0, cursor);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1) {
            const textAfterAt = textBeforeCursor.slice(atIndex + 1);
            // Only trigger if there's no space in the query (still typing the name)
            if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
                setMentionState({ active: true, query: textAfterAt, startIndex: atIndex });
                setSelectedIndex(0);
                return;
            }
        }
        setMentionState(prev => ({ ...prev, active: false }));
    }, [onChange]);

    // Insert chosen mention into the textarea value
    const insertMention = useCallback((user) => {
        const { startIndex } = mentionState;
        const cursor = textareaRef.current?.selectionStart ?? value.length;
        // Replace from "@" up to cursor with the formatted mention token
        const before = value.slice(0, startIndex);
        const after = value.slice(cursor);
        const mentionToken = `@[${user.name}](${user.id}) `;
        const newValue = before + mentionToken + after;
        onChange(newValue);
        setMentionState({ active: false, query: '', startIndex: -1 });

        // Restore focus & position cursor after insertion
        setTimeout(() => {
            if (textareaRef.current) {
                const newPos = before.length + mentionToken.length;
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    }, [mentionState, value, onChange]);

    // Keyboard navigation inside the dropdown
    const handleKeyDown = useCallback((e) => {
        if (!mentionState.active || filteredUsers.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (filteredUsers[selectedIndex]) {
                e.preventDefault();
                insertMention(filteredUsers[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setMentionState(prev => ({ ...prev, active: false }));
        }
    }, [mentionState.active, filteredUsers, selectedIndex, insertMention]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                textareaRef.current && !textareaRef.current.contains(e.target)) {
                setMentionState(prev => ({ ...prev, active: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className={className}
            />

            {/* @mention dropdown */}
            {mentionState.active && filteredUsers.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 bottom-full mb-1 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                    <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Mencionar usuário</span>
                        {mentionState.query && (
                            <span className="text-[10px] text-slate-400">"{mentionState.query}"</span>
                        )}
                    </div>
                    <ul className="py-1 max-h-52 overflow-y-auto">
                        {filteredUsers.map((u, i) => (
                            <li key={u.id}>
                                <button
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent textarea blur
                                        insertMention(u);
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                                        i === selectedIndex
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <User className="w-3 h-3 text-indigo-500" />
                                    </div>
                                    <span className="font-medium truncate">{u.name}</span>
                                </button>
                            </li>
                        ))}
                        {filteredUsers.length === 0 && mentionState.query && (
                            <li className="px-3 py-3 text-sm text-slate-400 text-center">
                                Nenhum usuário encontrado
                            </li>
                        )}
                    </ul>
                    <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100">
                        <span className="text-[9px] text-slate-400">↑↓ navegar · Enter selecionar · Esc fechar</span>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Renders annotation text with @[Name](id) tokens highlighted as badges.
 */
export function renderAnnotationText(text) {
    if (!text) return null;
    const parts = text.split(/(@\[[^\]]+\]\(\d+\))/g);
    return parts.map((part, i) => {
        const match = part.match(/^@\[([^\]]+)\]\((\d+)\)$/);
        if (match) {
            return (
                <span
                    key={i}
                    className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-1.5 py-0 text-[11px] font-bold"
                >
                    @{match[1]}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}
