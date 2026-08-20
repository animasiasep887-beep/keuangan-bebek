import React, { useState } from 'react';
import { RefreshCw, PlusCircle, CheckCircle2, BookOpen, Trash2 } from 'lucide-react';
import type { Kandang, PopulasiBebek, KodeAkun } from '../types';
import { StorageService } from '../services/storage';

interface PengaturanViewProps {
  kandangList: Kandang[];
  populasiList: PopulasiBebek[];
  kodeAkunList: KodeAkun[];
  onRefreshData: () => void;
  onResetZero: () => void;
  onResetDemo: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  kandangList,
  populasiList,
  kodeAkunList,
  onRefreshData,
  onResetZero,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'kandang' | 'populasi' | 'coa'>('kandang');

  // Form for New Kandang
  const [namaKandang, setNamaKandang] = useState('');
  const [kapasitas, setKapasitas] = useState(500);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddKandang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKandang.trim()) return;

    const newKandang: Kandang = {
      id: `k-${Date.now()}`,
      namaKandang,
      kapasitas,
      status: 'AKTIF',
    };

    StorageService.saveKandang([...kandangList, newKandang]);
    setSuccessMsg('Kandang Baru Berhasil Ditambahkan!');
    setNamaKandang('');
    onRefreshData();

    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleDeleteKandang = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit kandang ini?')) {
      StorageService.deleteKandang(id);
      onRefreshData();
    }
  };

  const handleDeletePopulasi = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data populasi bebek ini?')) {
      StorageService.deletePopulasi(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-amber-400" />
            Pengaturan Master Data & Kandang
          </h2>
          <p className="text-xs text-slate-400">
            Kelola unit kandang, batch populasi bebek, dan bagan akun akuntansi (Chart of Accounts).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('kandang')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'kandang' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
            >
              Kandang ({kandangList.length})
            </button>
            <button
              onClick={() => setActiveTab('populasi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'populasi' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
            >
              Populasi ({populasiList.length})
            </button>
            <button
              onClick={() => setActiveTab('coa')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'coa' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
            >
              Chart of Accounts ({kodeAkunList.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetZero}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 flex items-center gap-1"
              title="Kosongkan seluruh data ke 0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Mulai dari 0
            </button>
            <button
              onClick={onResetDemo}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700"
              title="Muat Data Contoh Demo (30 Hari)"
            >
              Muat Data Demo
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* TAB 1: Kandang */}
      {activeTab === 'kandang' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-amber-400" />
              Tambah Kandang Baru
            </h3>
            <form onSubmit={handleAddKandang} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Kandang</label>
                <input
                  type="text"
                  placeholder="Contoh: Kandang Delta (Selatan)"
                  value={namaKandang}
                  onChange={(e) => setNamaKandang(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kapasitas (Ekor)</label>
                <input
                  type="number"
                  value={kapasitas}
                  onChange={(e) => setKapasitas(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                + Simpan Kandang
              </button>
            </form>
          </div>

          <div className="md:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Daftar Kandang Terdaftar</h3>
            <div className="space-y-2">
              {kandangList.map((k) => (
                <div key={k.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{k.namaKandang}</p>
                    <p className="text-xs text-slate-400">Kapasitas Maksimal: {k.kapasitas} ekor</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {k.status}
                    </span>
                    <button
                      onClick={() => handleDeleteKandang(k.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Hapus Kandang Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Populasi */}
      {activeTab === 'populasi' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Batch Populasi Bebek Petelur</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Kode Batch</th>
                  <th className="px-4 py-3">Tgl Masuk</th>
                  <th className="px-4 py-3">Jumlah Awal</th>
                  <th className="px-4 py-3 font-bold text-white">Jumlah Saat Ini</th>
                  <th className="px-4 py-3">Umur</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {populasiList.map((pop) => (
                  <tr key={pop.id}>
                    <td className="px-4 py-3 font-bold text-amber-400">{pop.kodeBatch}</td>
                    <td className="px-4 py-3">{pop.tglMasuk}</td>
                    <td className="px-4 py-3">{pop.jumlahAwal} ekor</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-400">{pop.jumlahSaatIni} ekor</td>
                    <td className="px-4 py-3">{pop.umurMinggu} minggu</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                        {pop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeletePopulasi(pop.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Hapus Populasi Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Chart of Accounts (Daftar Akun Akuntansi Standar)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Kode Akun</th>
                  <th className="px-4 py-3">Nama Akun</th>
                  <th className="px-4 py-3">Tipe Akun</th>
                  <th className="px-4 py-3">Saldo Normal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-medium">
                {kodeAkunList.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">{a.kode}</td>
                    <td className="px-4 py-3 font-bold text-white">{a.nama}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.tipe === 'REVENUE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : a.tipe === 'EXPENSE'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-sky-500/10 text-sky-400'
                        }`}
                      >
                        {a.tipe}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{a.saldoNormal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
