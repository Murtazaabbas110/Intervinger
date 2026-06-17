# Intervinger - Features & User Guide

## Table of Contents

1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Problem Library](#problem-library)
4. [Interview Sessions](#interview-sessions)
5. [Code Editor](#code-editor)
6. [Real-time Chat](#real-time-chat)
7. [Video Conferencing](#video-conferencing)
8. [Code Execution](#code-execution)

---

## Authentication

### Overview

Intervinger uses Clerk for secure authentication. Users can sign up using email or social login options.

### Sign Up Process

1. Navigate to home page
2. Click "Get Started" or "Sign Up"
3. Choose authentication method:
   - Email verification
   - Google account
   - GitHub account
   - Other social providers (configured in Clerk)
4. Complete verification
5. Auto-redirect to Dashboard

### Sign In Process

1. Click "Sign In"
2. Enter credentials or select social option
3. Multi-factor authentication (if enabled)
4. Redirect to Dashboard

### Profile Management

1. Click profile avatar in top-right corner
2. Access profile settings
3. Options:
   - Update personal information
   - Change password
   - Manage connected accounts
   - Review security settings
   - Sign out

### Security Features

- **Two-Factor Authentication**: Available in Clerk settings
- **Session Management**: Active sessions shown in Clerk dashboard
- **Token Expiration**: Automatic token refresh
- **Secure Logout**: Clears all local authentication data

---

## Dashboard

### Overview

The Dashboard is the central hub where users can:

- View active sessions
- See recent interview history
- Track statistics
- Start new sessions

### Dashboard Components

#### 1. Statistics Cards

Displays key metrics:

- **Active Sessions**: Currently ongoing interviews
- **Completed Sessions**: Total interviews completed
- **Total Coding Time**: Cumulative time spent coding
- **Success Rate**: Percentage of completed sessions

#### 2. Active Sessions Panel

Shows ongoing sessions:

- Session ID or name
- Interviewer/Interviewee name
- Problem being solved
- Time elapsed
- Quick actions:
  - **Join Session**: Enter active interview
  - **View Details**: See more information
  - **End Session**: Complete the interview

#### 3. Recent Sessions Panel

Lists previous sessions:

- Date and time
- Problem solved
- Session duration
- Completion status
- Rating or feedback

#### 4. Welcome Section

Personalized greeting and quick actions:

- "Start New Interview" button
- "Browse Problems" link
- Tips for effective sessions

### Dashboard Actions

#### Start New Session

1. Click "Create New Session" button
2. Select a problem
3. Enter interviewee's information
4. Confirm session creation
5. Redirect to session page

#### Join Session

1. Click on active session
2. Accept camera/microphone permissions
3. Enter session interface

#### View Session History

1. Scroll to "Recent Sessions"
2. Click on any session
3. View:
   - Code written
   - Final solution
   - Session notes
   - Duration

---

## Problem Library

### Overview

The Problems section provides a curated library of coding interview questions, ranging from Easy to Hard difficulty.

### Problem Categories

#### By Difficulty

- **Easy**: Fundamentals (Arrays, Strings, Loops)
- **Medium**: Data Structures (Trees, Graphs, Dynamic Programming)
- **Hard**: Complex Algorithms (Advanced DP, Graph Theory)

#### By Topic

- Arrays & Hashing
- Linked Lists
- Stacks & Queues
- Binary Search
- Trees
- Graphs
- Dynamic Programming
- Sorting & Searching
- Two Pointers
- Intervals
- Matrix
- Bit Manipulation

### Problems Page Features

#### Problem List View

```
┌─────────────────────────────────────┐
│ Problem Title                       │
│ Difficulty: Easy  Category: Arrays  │
│ ─────────────────────────────────   │
│ Start Session → View Details →      │
└─────────────────────────────────────┘
```

#### Filtering Options

- Filter by difficulty level
- Filter by category
- Search by problem title
- Sort by:
  - Difficulty
  - Recent
  - Popularity

#### Problem Details View

When viewing a specific problem:

1. **Problem Description**
   - Full problem statement
   - Constraints and requirements
   - Example inputs/outputs
   - Edge cases to consider

2. **Examples**
   - Input/Output format
   - Explanation of expected behavior
   - Test cases

3. **Constraints**
   - Time complexity requirements
   - Space complexity limits
   - Array/String size ranges
   - Numeric value ranges

4. **Action Buttons**
   - "Start Interview Session": Create session with this problem
   - "View Solutions": See successful solutions (if available)

### Example Problem Structure

```
Problem: Two Sum
Difficulty: Easy
Category: Array, Hash Table

Description:
Given an array of integers nums and an integer target,
return the indices of the two numbers that add up to target.

Examples:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input: nums = [3,2,4], target = 6
Output: [1,2]

Constraints:
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
```

---

## Interview Sessions

### Overview

Sessions are real-time collaborative spaces where interviewer and interviewee solve problems together.

### Creating a Session

#### As Interviewer

1. Navigate to Problems page
2. Select a problem
3. Click "Start Interview Session"
4. Enter interviewee information:
   - Interviewee email or ID
   - Optional session notes
5. Click "Create Session"
6. Session created and ready

#### Session Initialization

- Stream Chat channel created
- Video call ID generated
- Shared code editor initialized
- Session URL generated for sharing

### Session Interface

```
┌─────────────────────────────────────────────────────────────┐
│ Session: Two Sum Interview                        [End Session]│
├──────────────────┬──────────────────────────────────────────┤
│ Problem Panel    │ Code Editor Panel                         │
│                  │                                          │
│ Description      │ function twoSum(nums, target) {          │
│ Examples         │   // Write solution here                │
│ Constraints      │ }                                        │
│                  │                                          │
│                  │ [Run Code] [Submit]                     │
├──────────────────┼──────────────────────────────────────────┤
│ Video Call       │ Chat Panel                              │
│ [Video Stream]   │ ┌────────────────────────────────────┐  │
│                  │ │ Messages:                          │  │
│                  │ │ John: Can you explain approach?   │  │
│                  │ │ Jane: Sure, I'll use hash table   │  │
│                  │ │                                    │  │
│                  │ │ [Type message...]                 │  │
│                  │ └────────────────────────────────────┘  │
│                  │ [Send]                                  │
└──────────────────┴──────────────────────────────────────────┘
```

### Session Status Tracking

#### During Session

- **Active**: Session is ongoing
- **Status**: Time elapsed, participants connected
- **Indicators**:
  - Green dot = User online
  - Audio/Video icons show media status
  - Connection quality indicator

#### Session Phases

1. **Initialization**
   - Participants join
   - Video/audio connect
   - Code editor loads
   - Chat becomes available

2. **Discussion**
   - Problem explained
   - Approach discussed
   - Edge cases clarified

3. **Coding**
   - Interviewee writes code
   - Interviewer provides feedback
   - Code is shared in real-time

4. **Testing**
   - Run code with test cases
   - Verify solution
   - Debug if needed

5. **Completion**
   - Solution approved
   - Session ends
   - Feedback provided

### Session Actions

#### Pause Session

- Temporarily pause without ending
- Both participants stay connected
- Resume at any time

#### End Session

- Officially close the interview
- Save final code and notes
- Provide rating/feedback
- Archive session

#### Download Session

- Export code written
- Download transcript
- Save video recording (if enabled)

---

## Code Editor

### Overview

The Code Editor (powered by Monaco Editor) enables real-time collaborative code writing.

### Editor Features

#### Language Support

- JavaScript/TypeScript
- Python
- Java
- C++
- C#
- SQL
- Go
- Rust
- And more...

#### Code Editor Toolbar

```
[Language Selector] [Theme Toggle] [Font Size] [Format] [Help]
```

#### Keyboard Shortcuts

- `Ctrl+S` or `Cmd+S`: Save code
- `Ctrl+/` or `Cmd+/`: Toggle comment
- `Ctrl+Shift+F` or `Cmd+Shift+F`: Format code
- `Ctrl+H` or `Cmd+H`: Find and replace
- `Tab`: Indent
- `Shift+Tab`: Unindent

#### Code Highlighting

- Syntax highlighting for selected language
- Error indicators (red squiggly underlines)
- Warning indicators (yellow underlines)
- IntelliSense suggestions

#### Sharing & Collaboration

- Both participants see real-time code changes
- Cursor positions visible (color-coded by participant)
- Change tracking/history
- Undo/Redo functionality

### Editor Actions

#### Writing Code

1. Select language at top
2. Start typing in editor
3. Changes appear in real-time for other participant
4. Use autocomplete (Ctrl+Space)

#### Formatting

1. Click "Format" button or press Ctrl+Shift+F
2. Code automatically formatted according to language rules

#### Save Code

- Auto-save enabled (saves to database)
- Manual save via Ctrl+S
- Saves to session history

#### Clear Code

- Resets editor to empty state
- Confirms before clearing
- Previous version recoverable from history

### Code Execution

See [Code Execution](#code-execution) section below.

---

## Real-time Chat

### Overview

Integrated chat system powered by Stream Chat for instant messaging during sessions.

### Chat Interface

```
┌────────────────────────────────┐
│ Chat: Interview Session        │
├────────────────────────────────┤
│                                │
│ John: Can you explain the      │
│ approach?                      │
│                                │
│ Jane: Sure! I'll use a hash    │
│ table to store values          │
│                                │
│ John: Good idea, what's the    │
│ time complexity?               │
│                                │
│ [Typing...]                    │
│                                │
├────────────────────────────────┤
│ [Type message...]       [Send] │
└────────────────────────────────┘
```

### Chat Features

#### Message Types

- **Text Messages**: Regular chat messages
- **Code Snippets**: Share code blocks
- **Reactions**: Emoji reactions to messages
- **Typing Indicator**: Shows when someone is typing

#### Message Actions

- Delete own message
- Edit message
- React with emoji
- Reply to specific message (threading)

#### Notifications

- @Mention notifications
- Sound alerts for new messages
- Desktop notifications (with permission)

### Chat Usage During Interview

#### For Interviewee

- Ask questions about problem
- Request clarification
- Share thoughts/approach
- Discuss optimizations

#### For Interviewer

- Provide feedback on code
- Ask follow-up questions
- Guide problem-solving
- Provide hints if needed

### Chat Best Practices

1. Keep messages clear and concise
2. Use code blocks for code snippets
3. Ask follow-up questions
4. Be respectful and professional
5. Use threading for long discussions

---

## Video Conferencing

### Overview

Integrated video conferencing powered by Stream Video SDK enables face-to-face interviews.

### Video Features

#### Video Quality

- **Adaptive bitrate**: Automatically adjusts to connection
- **HD quality**: Up to 1080p (depends on connection)
- **Screen sharing**: Share monitor/window

#### Camera & Microphone

- Toggle camera on/off
- Toggle microphone on/off
- Select input devices (camera, microphone)
- Adjust volume levels

### Video Interface

```
┌───────────────────┬────────────────────┐
│ Local Participant │ Remote Participant │
│ [John - Video]    │ [Jane - Video]     │
│                   │                    │
│ Camera: ON        │ Camera: ON         │
│ Mic: ON           │ Mic: ON            │
└───────────────────┴────────────────────┘

[Camera Toggle] [Mic Toggle] [Screen Share] [End Call]
```

### Screen Sharing

#### Starting Screen Share

1. Click "Share Screen" button
2. Select screen/window to share
3. Confirm sharing
4. Remote participant sees your screen

#### During Screen Share

- Can switch between camera and screen
- Can still use code editor
- Can still chat
- Remote can see code editor

#### Stopping Screen Share

1. Click "Stop Sharing" button
2. Returns to camera view

### Camera & Microphone Permissions

When joining session:

1. Browser requests camera permission
2. Browser requests microphone permission
3. Grant or deny permissions
4. Can change in browser settings later

### Connection Quality

#### Indicators

- **Green**: Good connection (Low latency, good bitrate)
- **Yellow**: Moderate connection (Some lag possible)
- **Red**: Poor connection (High latency, low bitrate)

#### Troubleshooting Connection Issues

1. **Move closer to router**
2. **Reduce other network usage**
3. **Close other applications**
4. **Check bandwidth** (need ~2.5 Mbps for HD video)
5. **Try different network**

### Video Best Practices

1. Ensure good lighting
2. Look at camera when speaking
3. Keep microphone at appropriate distance
4. Test audio/video before session
5. Use headphones to avoid echo

---

## Code Execution

### Overview

The code execution feature allows running and testing code directly within the platform using the Piston API.

### Running Code

#### Basic Execution

1. Write code in editor
2. Click "Run Code" button (or Ctrl+Enter)
3. Code executes on server
4. Output displayed in Output Panel

#### With Test Cases

1. Select test case from dropdown
2. Code runs with that test input
3. Output compared to expected output
4. Pass/Fail indicator shown

### Output Panel

```
┌─────────────────────────────┐
│ Output                      │
├─────────────────────────────┤
│ Input: nums=[2,7,11,15], t=9
│ ─────────────────────────────
│ Output:
│ [0, 1]
│ ─────────────────────────────
│ Expected:
│ [0, 1]
│ ─────────────────────────────
│ Status: ✓ PASS              │
│                             │
│ Execution Time: 12ms        │
│ Memory Used: 4.2MB          │
└─────────────────────────────┘
```

### Supported Languages

- JavaScript/Node.js
- Python 3
- Java
- C++
- C#
- Go
- Rust
- Ruby
- PHP
- SQL

### Code Execution Flow

```
User clicks "Run"
    ↓
Frontend sends code to backend
    ↓
Backend validates code
    ↓
Send to Piston API
    ↓
Execute code on sandbox
    ↓
Return output/errors
    ↓
Frontend displays result
```

### Handling Errors

#### Compilation Errors

```
Error: SyntaxError on line 3
Expected '}' but found 'undefined'
```

#### Runtime Errors

```
Error: TypeError
Cannot read property 'length' of undefined
```

#### Timeout Errors

```
Error: Execution timeout
Code exceeded 5 second execution limit
```

#### Output Errors

```
Expected: [0, 1]
Actual: [1, 0]
Status: FAIL
```

### Performance Metrics

After code execution:

- **Execution Time**: How long code took to run
- **Memory Used**: RAM consumed
- **Output Size**: Size of output
- **Status**: Pass/Fail indicator

### Best Practices

1. Test with multiple inputs
2. Check edge cases
3. Review code for efficiency
4. Watch execution time
5. Test before submitting

---

## Session Feedback & Ratings

### Post-Session Feedback

After session completion:

#### Interviewee Provides

- Interview difficulty rating (1-5)
- Interviewer rating (1-5)
- Comments/feedback
- Optional: Problems with technical setup

#### Interviewer Provides

- Interviewee performance (1-5)
- Technical skills assessment
- Communication skills rating
- Follow-up notes for evaluation

### Session Archive

Sessions are archived and can be reviewed:

- Solution code preserved
- Execution history
- Chat transcript
- Video recording (if enabled)
- Performance metrics

---

## Notifications

### In-App Notifications

#### Session Invitations

- New interview invitation
- Accept/Decline options
- Notification badge

#### Session Updates

- Session started
- Participant joined
- Session completed
- Feedback received

#### Chat Notifications

- New message (@mention)
- Important updates

### Desktop Notifications

- Requires browser permission
- Shows when tab is not active
- Can disable in settings

---

## Accessibility Features

### Keyboard Navigation

- Tab through interface elements
- Enter to select buttons
- Arrow keys for menus
- Escape to close modals

### Screen Reader Support

- ARIA labels on interactive elements
- Semantic HTML structure
- Alt text on images

### Visual Features

- High contrast mode
- Adjustable font sizes
- Color-blind friendly color scheme
- Dark/Light theme options

---

## Tips for Success

### For Interviewees

1. Communicate your thought process
2. Ask for clarification if needed
3. Test your solution thoroughly
4. Consider edge cases
5. Discuss time/space complexity

### For Interviewers

1. Be encouraging and supportive
2. Ask probing questions
3. Give constructive feedback
4. Allow adequate thinking time
5. Take notes for evaluation

### For Better Sessions

1. Join 5 minutes early to test setup
2. Use headphones for better audio
3. Minimize distractions
4. Keep problem description open
5. Take notes during session

---

## FAQs

**Q: Can I rejoin a session after disconnecting?**
A: Yes, if the session is still active. Click "Rejoin Session" or use the session link.

**Q: Is my code saved if the session ends unexpectedly?**
A: Yes, auto-save functionality saves code periodically.

**Q: Can I record the session?**
A: Recording capabilities can be enabled in settings (requires both participants' consent).

**Q: What happens after the session ends?**
A: Session is archived, code is saved, and you can provide/receive feedback.

**Q: Can I practice with recorded sessions?**
A: Yes, you can review past sessions to improve your interviewing/coding skills.
