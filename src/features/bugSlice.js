import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axios";

//
// ✅ 1. Create Bug
//
export const createBug = createAsyncThunk(
  "bugs/createBug",
  async (bugData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/bugs/create", bugData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating bug:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create bug"
      );
    }
  }
);

//
// ✅ 2. Fetch All Bugs by Project ID (for project detail view or full bug list)
//
export const fetchAllBugsByProjectId = createAsyncThunk(
  "bugs/fetchAllBugsByProjectId",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/bugs/getallbugByProjectId/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bugs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bugs"
      );
    }
  }
);

//
// ✅ 3. Fetch Bugs by Project ID (used separately with isolated state)
//
export const fetchBugByProjectId = createAsyncThunk(
  "bugs/fetchBugByProjectId",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/bugs/getallbugByProjectId/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bugs for project:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bugs by project"
      );
    }
  }
);

//
// ✅ 4. Resolve Bug
//
export const resolveBug = createAsyncThunk(
  "bugs/resolveBug",
  async ({bugId,delayReason,resolutionNote}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/bugs/resolve/${bugId}`,{
        delayReason,resolutionNote
      });
      return response.data;
    } catch (error) {
      console.error("Error resolving bug:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to resolve bug"
      );
    }
  }
);
//
// ✅ 5. Fetch Bugs by Employee ID
//
export const fetchBugByEmployeeId = createAsyncThunk(
  "bugs/fetchBugByEmployeeId",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/bugs/assigned/${employeeId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching bugs for employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee bugs"
      );
    }
  }
);
// Download Bugs by ProjectId
export const downloadBugsByProjectId = createAsyncThunk(
  "bugs/downloadBugsByProjectId",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/bugs/download/${projectId}`, {
        responseType: "blob", // important to handle file download
      });

      // Create Blob and trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bugs_${projectId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return "Download successful";
    } catch (error) {
      console.error("Error downloading bugs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to download bugs"
      );
    }
  }
);
// Download Bugs by member id

export const downloadBugsByMemberId = createAsyncThunk(
  "bugs/downloadBugsByMemberId",
  async ({projectId,memberId}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/bugs/download-by-assignee/${projectId}/${memberId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bugs_member_${memberId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return "Member bug report downloaded successfully";
    } catch (error) {
      console.error("Error downloading member bugs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to download member bug report"
      );
    }
  }
);
// Fetch Bugs by project ID and employee ID
export const fetchEmployeeProjectBugs = createAsyncThunk(
  'bugs/fetchEmployeeProjectBugs',
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/bugs/getbugbyprojectandbmemberid/${projectId}/${employeeId}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data) {
        throw new Error('No Bugs found');
      }

      return response.data; // ✅ Return the data as-is without wrapping
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Fetch failed');
    }
  }
);
//
// ✅ Initial State
//
const initialState = {
  bug: null,
  bugs: [],
  bugsByProjectId: [], // specific project bug list
  bugsByEmployeeId: [],
employeeProjectBugs: {}, // Bugs grouped by project and employee
  loading: {
    bugCreation: false,
    bugsFetch: false,
    bugsByProjectId: false,
    bugResolve: false,
    bugsByEmployeeId: false,
     bugDownload: false,
     memberBugDownload: false,
  },
  error: {
    bugCreation: null,
    bugsFetch: null,
    bugsByProjectId: null,
    bugResolve: null,
    bugsByEmployeeId: null,
    bugDownload: null,
     memberBugDownload: null,
  },
  successMessage: null,
};



//
// ✅ Slice
//
const bugSlice = createSlice({
  name: "bugs",
  initialState,
  reducers: {
    resetBugCreation: (state) => {
      state.loading.bugCreation = false;
      state.error.bugCreation = null;
      state.successMessage = null;
      state.bug = null;
    },
    clearErrors: (state) => {
      state.error.bugCreation = null;
      state.error.bugsFetch = null;
      state.error.bugResolve = null;
      state.error.bugsByProjectId = null;
    },
    clearProjectBugs: (state) => {
      state.bugsByProjectId = [];
    },
  },
  extraReducers: (builder) => {
    //
    // ➕ Create Bug
    //
    builder
      .addCase(createBug.pending, (state) => {
        state.loading.bugCreation = true;
        state.error.bugCreation = null;
        state.successMessage = null;
      })
      .addCase(createBug.fulfilled, (state, action) => {
        state.loading.bugCreation = false;
        state.bug = action.payload;
        state.bugs.push(action.payload);
        state.successMessage = "Bug created successfully";
      })
      .addCase(createBug.rejected, (state, action) => {
        state.loading.bugCreation = false;
        state.error.bugCreation = action.payload;
      });

    //
    // 📥 Fetch All Bugs (global/project dashboard)
    //
    builder
      .addCase(fetchAllBugsByProjectId.pending, (state) => {
        state.loading.bugsFetch = true;
        state.error.bugsFetch = null;
      })
      .addCase(fetchAllBugsByProjectId.fulfilled, (state, action) => {
        state.loading.bugsFetch = false;
        state.bugs = action.payload;
      })
      .addCase(fetchAllBugsByProjectId.rejected, (state, action) => {
        state.loading.bugsFetch = false;
        state.error.bugsFetch = action.payload;
      });

    //
    // 📥 Fetch Bugs for One Project (in its own array)
    //
    builder
      .addCase(fetchBugByProjectId.pending, (state) => {
        state.loading.bugsByProjectId = true;
        state.error.bugsByProjectId = null;
      })
      .addCase(fetchBugByProjectId.fulfilled, (state, action) => {
        state.loading.bugsByProjectId = false;
        state.bugsByProjectId = action.payload;
      })
      .addCase(fetchBugByProjectId.rejected, (state, action) => {
        state.loading.bugsByProjectId = false;
        state.error.bugsByProjectId = action.payload;
      });

    //
    // ✅ Resolve Bug
    //
    builder
      .addCase(resolveBug.pending, (state) => {
        state.loading.bugResolve = true;
        state.error.bugResolve = null;
        state.successMessage = null;
      })
      .addCase(resolveBug.fulfilled, (state, action) => {
        state.loading.bugResolve = false;
        state.successMessage = action.payload.message;

        const updatedBug = action.payload.bug;

        // Update in main list
        state.bugs = state.bugs.map((bug) =>
          bug.bug_id === updatedBug.bug_id ? updatedBug : bug
        );

        // Update in project-specific list
        state.bugsByProjectId = state.bugsByProjectId.map((bug) =>
          bug.bug_id === updatedBug.bug_id ? updatedBug : bug
        );
      })
      .addCase(resolveBug.rejected, (state, action) => {
        state.loading.bugResolve = false;
        state.error = action.payload;
        // state.error.bugResolve = action.payload;
      });

    // 📥 Fetch Bugs for Employee
    builder
      .addCase(fetchBugByEmployeeId.pending, (state) => {
        state.loading.bugsByEmployeeId = true;
        state.error.bugsByEmployeeId = null;
      })
      .addCase(fetchBugByEmployeeId.fulfilled, (state, action) => {
        state.loading.bugsByEmployeeId = false;
        state.bugsByEmployeeId = action.payload;
      })
      .addCase(fetchBugByEmployeeId.rejected, (state, action) => {
        state.loading.bugsByEmployeeId = false;
        state.error.bugsByEmployeeId = action.payload;
      })
      
      //downlad pdf bug report
      builder
  .addCase(downloadBugsByProjectId.pending, (state) => {
    state.loading.bugDownload = true;
    state.error.bugDownload = null;
    state.successMessage = null;
  })
  .addCase(downloadBugsByProjectId.fulfilled, (state, action) => {
    state.loading.bugDownload = false;
    state.successMessage = action.payload;
  })
  .addCase(downloadBugsByProjectId.rejected, (state, action) => {
    state.loading.bugDownload = false;
    state.error.bugDownload = action.payload;
  })
  
  
  //member bug downlaod 
  builder
  .addCase(downloadBugsByMemberId.pending, (state) => {
    state.loading.memberBugDownload = true;
    state.error.memberBugDownload = null;
    state.successMessage = null;
  })
  .addCase(downloadBugsByMemberId.fulfilled, (state, action) => {
    state.loading.memberBugDownload = false;
    state.successMessage = action.payload;
  })
  .addCase(downloadBugsByMemberId.rejected, (state, action) => {
    state.loading.memberBugDownload = false;
    state.error.memberBugDownload = action.payload;
  })


// Fetch Bugs by project ID and employee ID

  
  .addCase(fetchEmployeeProjectBugs.pending, (state) => {
    state.status = 'loading';
    state.error = null;
  })
  .addCase(fetchEmployeeProjectBugs.fulfilled, (state, action) => {
    state.status = 'succeeded';
    const { projectId, employeeId } = action.meta.arg; // ✅ Get projectId and employeeId from arguments
    const bugs = action.payload.data; // ✅ Use the response data as-is
  
    if (!state.employeeProjectBugs[projectId]) {
      state.employeeProjectBugs[projectId] = {};
    }
    state.employeeProjectBugs[projectId][employeeId] = bugs; // ✅ Store it exactly as received
  })
  .addCase(fetchEmployeeProjectBugs.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
  });
;

      ;
  },
});

//
// ✅ Exports
//
export const { resetBugCreation, clearErrors, clearProjectBugs } =
  bugSlice.actions;

 

  export const selectEmployeeProjectBugs = (state, projectId, employeeId) => {
  return state.bugs.employeeProjectBugs[projectId]?.[employeeId] || [];  // Changed 'task' to 'bugs'
};
export default bugSlice.reducer;
