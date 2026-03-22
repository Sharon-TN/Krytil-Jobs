import { createContext, useEffect, useState, useCallback } from "react"; /* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { user } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: '',
        category: []
    })

    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    // Function to fetch jobs with search filters
    const fetchJobs = useCallback(async () => {
        try {
            // Build query params
            const params = new URLSearchParams();

            if (searchFilter.title) {
                params.append('keyword', searchFilter.title);
                setIsSearched(true);
            }

            if (searchFilter.location) {
                params.append('location', searchFilter.location);
                setIsSearched(true);
            }

            if (searchFilter.category && searchFilter.category.length > 0) {
                params.append('category', searchFilter.category.join(','));
                setIsSearched(true);
            }

            const queryString = params.toString();
            const url = queryString
                ? `${backendUrl}/api/jobs?${queryString}`
                : `${backendUrl}/api/jobs`;

            const { data } = await axios.get(url);

            if (data.success) {
                setJobs(data.jobs);

                // Show toast if search was performed and no results
                if (isSearched && data.jobs.length === 0) {
                    toast.info('No jobs found matching your criteria');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [searchFilter, backendUrl, isSearched])

    // Function to fetch company data
    const fetchCompanyData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company',
                { headers: { token: companyToken } }
            )
            if (data.success) {
                setCompanyData(data.company)
            } else {
                // Silent fail for invalid tokens - user will be prompted to login when needed
                console.log('Invalid company token, clearing...');
                setCompanyToken(null);
                localStorage.removeItem('companyToken');
            }
        } catch (error) {
            // Silent fail - don't show toast on initial load with invalid token
            console.log('Company data fetch error:', error.message);
            setCompanyToken(null);
            localStorage.removeItem('companyToken');
        }
    }, [companyToken, backendUrl])

    // Function to fetch user Data
    const fetchUserData = useCallback(async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/users/user',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setUserData(data.user)
                return data.user
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        return null
    }, [backendUrl, getToken])

    // Function to fetch user's applied application data
    const fetchUserApplications = useCallback(async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/users/applications',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setUserApplications(data.applications)
                return data.applications
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }, [backendUrl, getToken])

    useEffect(() => {
        fetchJobs()
        const storeCompanyToken = localStorage.getItem('companyToken')
        if (storeCompanyToken) {
            setCompanyToken(storeCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserApplications()
        }
    }, [user])

    const value = {
        setSearchFilter,
        searchFilter,
        isSearched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        backendUrl,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        fetchUserData,
        fetchUserApplications,
        fetchJobs
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}