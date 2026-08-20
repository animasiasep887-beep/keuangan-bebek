import React, { useState } from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';
import type { AsetTetap, HutangPiutang } from '../types';
import { formatIDR } from '../utils/exportUtils';
import { StorageService } from '../services/storage';

interface AsetKewajibanViewProps {
  asetList: AsetTetap[];
  hpList: HutangPiutang[];
  onRefreshData: () => void;
}

export const AsetKewajibanView: React.FC<AsetKewajibanViewProps> = ({
  asetList,
  hpList,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'aset' | 'hutang_piutang'>('aset');

  // Total Valuasi Aset Tetap
  const totalPerolehan = asetList.reduce((acc, a) => acc + a.nilaiPerolehan, 0);
  const totalNilaiBuku = asetList.reduce((acc, a) => acc + a.nilaiBuku, 0);

  // Total Hutang & Piutang
  const totalPiutang = hpList
    .filter((hp) => hp.jenis === 'PIUTANG' && hp.status === 'BELUM_LUNAS')
    .reduce((acc, hp) => acc + hp.sisaNominal, 0);

  const totalHutang = hpList
    .filter((hp) => hp.jenis === 'HUTANG' && hp.status === 'BELUM_LUNAS')
    .reduce((acc, hp) => acc + hp.sisaNominal, 0);

  const handleStatusChange = (id: string, newStatus: 'LUNAS' | 'BELUM_LUNAS') => {
    const updated = hpList.map((hp) =>
      hp.id === id ? { ...hp, status: newStatus, sisaNominal: newStatus === 'LUNAS' ? 0 : hp.nominalTotal } : hp
    );
    StorageService.saveHutangPiutang(updated);
    onRefreshData();
  };

  const handleDeleteAset = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan aset ini?')) {
      StorageService.deleteAset(id);
      onRefreshData();
    }
  };

  const handleDeleteHP = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan hutang/piutang ini?')) {
      StorageService.deleteHutangPiutang(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            Modul Aset Perusahaan & Kewajiban (Hutang / Piutang)
          </h2>
          <p className="text-xs text-slate-400">
            Valuasi bangunan kandang, mesin/peralatan, populasi ternak, dan amortisasi penyusutan.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('aset')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'aset' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aset Perusahaan ({asetList.length})
          </button>
          <button
            onClick={() => setActiveTab('hutang_piutang')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'hutang_piutang'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hutang & Piutang ({hpList.length})
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold">Total Nilai Buku Aset Tetap</p>
          <p className="text-2xl font-black text-sky-400 mt-1">{formatIDR(totalNilaiBuku)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Perolehan: {formatIDR(totalPerolehan)}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold">Total Piutang Usaha (Tagihan)</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatIDR(totalPiutang)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Belum dilunasi pengepul</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold">Total Hutang Usaha (Kewajiban)</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{formatIDR(totalHutang)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Kewajiban pakan & supplier</p>
        </div>
      </div>

      {/* TAB 1: Tabel Aset Tetap */}
      {activeTab === 'aset' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Daftar Aset Perusahaan & Amortisasi Biologis</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Nama Aset</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Nilai Perolehan</th>
                  <th className="px-4 py-3">Akumulasi Penyusutan</th>
                  <th className="px-4 py-3 font-bold text-sky-400">Nilai Buku Saat Ini</th>
                  <th className="px-4 py-3">Penyusutan / Bln</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-medium">
                {asetList.map((aset) => (
                  <tr key={aset.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{aset.namaAset}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {aset.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatIDR(aset.nilaiPerolehan)}</td>
                    <td className="px-4 py-3 text-rose-400">{formatIDR(aset.akumulasiPenyusutan)}</td>
                    <td className="px-4 py-3 font-black text-sky-400">{formatIDR(aset.nilaiBuku)}</td>
                    <td className="px-4 py-3 text-amber-400">{formatIDR(aset.penyusutanBulanan)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteAset(aset.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Hapus Aset Ini"
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

      {/* TAB 2: Tabel Hutang & Piutang */}
      {activeTab === 'hutang_piutang' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Monitoring Hutang & Piutang Jatuh Tempo</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Kontak / Nama Pihak</th>
                  <th className="px-4 py-3">Keterangan</th>
                  <th className="px-4 py-3">Nominal Total</th>
                  <th className="px-4 py-3 font-bold text-white">Sisa Nominal</th>
                  <th className="px-4 py-3">Jatuh Tempo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-medium">
                {hpList.map((hp) => {
                  const isPiutang = hp.jenis === 'PIUTANG';
                  const isLunas = hp.status === 'LUNAS';
                  return (
                    <tr key={hp.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPiutang ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {hp.jenis}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-white">{hp.namaKontak}</td>
                      <td className="px-4 py-3 text-slate-300">{hp.deskripsi}</td>
                      <td className="px-4 py-3">{formatIDR(hp.nominalTotal)}</td>
                      <td className="px-4 py-3 font-black text-amber-400">{formatIDR(hp.sisaNominal)}</td>
                      <td className="px-4 py-3 text-slate-400">{hp.tglJatuhTempo}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLunas ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {hp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                        {!isLunas ? (
                          <button
                            onClick={() => handleStatusChange(hp.id, 'LUNAS')}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400"
                          >
                            Tandai Lunas
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Selesai</span>
                        )}

                        <button
                          onClick={() => handleDeleteHP(hp.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus Catatan Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
