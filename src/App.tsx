import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import TrackerPage from './pages/TrackerPage'
import ManagePage from './pages/ManagePage'

export default function App() {
  return (
    <PhoneFrame>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TrackerPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PhoneFrame>
  )
}
