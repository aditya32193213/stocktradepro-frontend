/**
 * File: hooks.js
 * Purpose:
 * - Typed and centralized Redux hooks
 *
 * Flow:
 * - Wraps useDispatch and useSelector
 * - Provides consistent hooks across the app
 *
 * Key Responsibilities:
 * - Improve code readability
 * - Enable easy future extension (e.g., typed dispatch)
 */

import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
