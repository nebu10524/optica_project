<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Carga los catalogos base del sistema (datos de referencia).
 * Es idempotente: usa updateOrInsert por 'codigo'/'nombre'.
 */
class CatalogosSeeder extends Seeder
{
    public function run(): void
    {
        $this->clasificacionesRd();
        $this->nivelesUrgencia();
        $this->nivelesConfianza();
        $this->signos();
        $this->modelosIa();
        $this->especialidades();
        $this->estadosCita();
        $this->tiposLente();
        $this->materialesLente();
        $this->tratamientosLente();
    }

    private function clasificacionesRd(): void
    {
        $datos = [
            ['codigo' => 'sin_rd',   'nombre' => 'Sin RD',                'color_hex' => '#22c55e', 'orden' => 1],
            ['codigo' => 'leve',     'nombre' => 'Leve',                  'color_hex' => '#eab308', 'orden' => 2],
            ['codigo' => 'moderada', 'nombre' => 'Moderada',              'color_hex' => '#f97316', 'orden' => 3],
            ['codigo' => 'severa',   'nombre' => 'Severa/Proliferativa',  'color_hex' => '#ef4444', 'orden' => 4],
        ];
        foreach ($datos as $d) {
            DB::table('clasificaciones_rd')->updateOrInsert(
                ['codigo' => $d['codigo']],
                $d + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function nivelesUrgencia(): void
    {
        $datos = [
            ['codigo' => 'rutina',    'nombre' => 'Rutina',    'color_hex' => '#22c55e', 'dias_sugeridos' => 365],
            ['codigo' => 'prioridad', 'nombre' => 'Prioridad', 'color_hex' => '#f97316', 'dias_sugeridos' => 30],
            ['codigo' => 'urgente',   'nombre' => 'Urgente',   'color_hex' => '#ef4444', 'dias_sugeridos' => 7],
        ];
        foreach ($datos as $d) {
            DB::table('niveles_urgencia')->updateOrInsert(
                ['codigo' => $d['codigo']],
                $d + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function nivelesConfianza(): void
    {
        foreach (['alto' => 'Alto', 'medio' => 'Medio', 'bajo' => 'Bajo'] as $codigo => $nombre) {
            DB::table('niveles_confianza')->updateOrInsert(
                ['codigo' => $codigo],
                ['nombre' => $nombre, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function signos(): void
    {
        $signos = [
            'microaneurismas'    => 'Microaneurismas',
            'hemorragias'        => 'Hemorragias retinianas',
            'exudados_duros'     => 'Exudados duros',
            'exudados_blandos'   => 'Exudados blandos (algodon)',
            'neovascularizacion' => 'Neovascularizacion',
            'edema_macular'      => 'Edema macular',
        ];
        foreach ($signos as $codigo => $nombre) {
            DB::table('catalogo_signos')->updateOrInsert(
                ['codigo' => $codigo],
                ['nombre' => $nombre, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function modelosIa(): void
    {
        DB::table('modelos_ia')->updateOrInsert(
            ['nombre' => 'gemini-2.5-flash'],
            ['proveedor' => 'Google', 'version' => '2.5', 'activo' => true, 'created_at' => now(), 'updated_at' => now()]
        );
    }

    private function especialidades(): void
    {
        foreach (['Optometria', 'Oftalmologia'] as $nombre) {
            DB::table('especialidades')->updateOrInsert(
                ['nombre' => $nombre],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function estadosCita(): void
    {
        $datos = [
            ['codigo' => 'pendiente',  'nombre' => 'Pendiente',  'color_hex' => '#94a3b8'],
            ['codigo' => 'confirmada', 'nombre' => 'Confirmada', 'color_hex' => '#2563eb'],
            ['codigo' => 'atendida',   'nombre' => 'Atendida',   'color_hex' => '#22c55e'],
            ['codigo' => 'cancelada',  'nombre' => 'Cancelada',  'color_hex' => '#ef4444'],
        ];
        foreach ($datos as $d) {
            DB::table('estados_cita')->updateOrInsert(
                ['codigo' => $d['codigo']],
                $d + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function tiposLente(): void
    {
        foreach (['Monofocal', 'Bifocal', 'Progresivo', 'Ocupacional'] as $nombre) {
            DB::table('tipos_lente')->updateOrInsert(
                ['nombre' => $nombre],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function materialesLente(): void
    {
        $datos = [
            ['nombre' => 'CR-39',          'indice_refraccion' => 1.50],
            ['nombre' => 'Policarbonato',  'indice_refraccion' => 1.59],
            ['nombre' => 'Trivex',         'indice_refraccion' => 1.53],
            ['nombre' => 'Alto indice',    'indice_refraccion' => 1.67],
        ];
        foreach ($datos as $d) {
            DB::table('materiales_lente')->updateOrInsert(
                ['nombre' => $d['nombre']],
                $d + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    private function tratamientosLente(): void
    {
        foreach (['Antirreflejo', 'Fotocromatico', 'Filtro luz azul', 'Polarizado', 'Endurecido'] as $nombre) {
            DB::table('tratamientos_lente')->updateOrInsert(
                ['nombre' => $nombre],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
