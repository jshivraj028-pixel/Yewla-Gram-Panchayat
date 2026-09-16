import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Globe,
  Bell,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [officeDetails, setOfficeDetails] = useState({
    gpNameEn: 'Yewla Gram Panchayat',
    gpNameMr: 'येवला ग्रामपंचायत कार्यालय',
    taluka: 'Yewla (येवला)',
    district: 'Jalna (जालना)',
    state: 'Maharashtra',
    pincode: '423401',
    officePhone: '02559-222100',
    email: 'contact@yewlagp.in',
    officeAddress: 'Gram Panchayat Bhavan, Main Market Road, Yewla, Dist. Jalna - 423401',
    officeHours: 'Monday to Saturday: 09:30 AM - 05:30 PM',
    grievanceHours: 'Daily 10:00 AM - 01:00 PM',
  });

  const [officials, setOfficials] = useState({
    sarpanch: 'Smt. Surekha Patil (सरपंच)',
    sarpanchPhone: '9822012345',
    upSarpanch: 'Shri. Ramesh Gaikwad (उपसरपंच)',
    upSarpanchPhone: '9822054321',
    gramSevak: 'Shri. Sachin Deshmukh (ग्रामसेवक / ग्रामविकास अधिकारी)',
    gramSevakPhone: '9423011223',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ग्रामपंचायत कार्यालय सेटिंग्ज व माहिती</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Panchayat Office Configuration & Official Representatives Profile
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Office General Details Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Gram Panchayat Office Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Panchayat Name (English)
              </label>
              <input
                type="text"
                value={officeDetails.gpNameEn}
                onChange={(e) => setOfficeDetails({ ...officeDetails, gpNameEn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ग्रामपंचायत नाव (मराठी)
              </label>
              <input
                type="text"
                value={officeDetails.gpNameMr}
                onChange={(e) => setOfficeDetails({ ...officeDetails, gpNameMr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Taluka / Sub-District</label>
              <input
                type="text"
                value={officeDetails.taluka}
                onChange={(e) => setOfficeDetails({ ...officeDetails, taluka: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={officeDetails.district}
                onChange={(e) => setOfficeDetails({ ...officeDetails, district: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Landline</label>
              <input
                type="text"
                value={officeDetails.officePhone}
                onChange={(e) => setOfficeDetails({ ...officeDetails, officePhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={officeDetails.email}
                onChange={(e) => setOfficeDetails({ ...officeDetails, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Full Postal Address</label>
              <input
                type="text"
                value={officeDetails.officeAddress}
                onChange={(e) =>
                  setOfficeDetails({ ...officeDetails, officeAddress: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Office Timings</label>
              <input
                type="text"
                value={officeDetails.officeHours}
                onChange={(e) =>
                  setOfficeDetails({ ...officeDetails, officeHours: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Citizen Grievance Redressal Hours
              </label>
              <input
                type="text"
                value={officeDetails.grievanceHours}
                onChange={(e) =>
                  setOfficeDetails({ ...officeDetails, grievanceHours: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Panchayat Leadership Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Key Elected & Appointed Officials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sarpanch (सरपंच)</label>
              <input
                type="text"
                value={officials.sarpanch}
                onChange={(e) => setOfficials({ ...officials, sarpanch: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sarpanch Contact No.</label>
              <input
                type="tel"
                value={officials.sarpanchPhone}
                onChange={(e) => setOfficials({ ...officials, sarpanchPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Up-Sarpanch (उपसरपंच)</label>
              <input
                type="text"
                value={officials.upSarpanch}
                onChange={(e) => setOfficials({ ...officials, upSarpanch: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Up-Sarpanch Contact No.</label>
              <input
                type="tel"
                value={officials.upSarpanchPhone}
                onChange={(e) => setOfficials({ ...officials, upSarpanchPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Gram Sevak / VDO (ग्रामसेवक)
              </label>
              <input
                type="text"
                value={officials.gramSevak}
                onChange={(e) => setOfficials({ ...officials, gramSevak: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gram Sevak Contact No.</label>
              <input
                type="tel"
                value={officials.gramSevakPhone}
                onChange={(e) => setOfficials({ ...officials, gramSevakPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Current Officer Profile & System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Current Authenticated Session</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Officer Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Role:</span>{' '}
                <span className="uppercase font-bold text-emerald-700">{user?.role}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Designation:</span>{' '}
                {user?.designation || 'Gram Panchayat Official'}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Mobile:</span> {user?.mobile}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Platform & System Status</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Build Version:</span> v1.0.0-PROD
              </p>
              <p>
                <span className="font-semibold text-slate-700">Backend API:</span>{' '}
                <span className="text-emerald-700 font-mono font-semibold">http://localhost:5000/api</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Citizen Mobile App:</span> Flutter 3.44
                (Bilingual Marathi/English)
              </p>
              <p>
                <span className="font-semibold text-slate-700">Security:</span> JWT & RBAC Active
              </p>
              <p>
                <span className="font-semibold text-slate-700">Database:</span> MongoDB In-Memory / Replica
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings / बदल जतन करा</span>
          </button>
        </div>
      </form>
    </div>
  );
}
