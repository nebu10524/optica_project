<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Retina</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #1f2937; font-size: 12px; margin: 22px; }
        .cover { page-break-after: always; }
        .brand-wrap { display: table; width: 100%; margin-bottom: 22px; }
        .brand-wrap .cell { display: table-cell; vertical-align: middle; }
        .brand { font-size: 36px; font-weight: 800; color: #1e3a5f; letter-spacing: 0.6px; margin: 0; }
        .brand-sub { font-size: 11px; color: #8aa0bf; letter-spacing: 3px; text-transform: uppercase; margin: 2px 0 0; }
        .cover-card {
            border: 1px solid #dbe5f3;
            border-radius: 12px;
            padding: 18px;
            background: #f8fbff;
            margin-bottom: 14px;
        }
        .cover-title { font-size: 24px; font-weight: 800; color: #163155; margin: 0 0 8px; }
        .cover-sub { font-size: 13px; color: #5b6f8f; margin: 0; line-height: 1.6; }
        .meta { width: 100%; border-collapse: collapse; margin-top: 14px; }
        .meta td, .meta th { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
        .meta .h { width: 24%; background: #f8fafc; color: #475569; font-weight: 700; }
        .page-break { page-break-before: always; }
        .top-row { display: table; width: 100%; margin-bottom: 12px; }
        .top-row .col { display: table-cell; vertical-align: middle; }
        .brand-block { display: table; }
        .brand-block .cell { display: table-cell; vertical-align: middle; padding-right: 10px; }
        .meta-right { text-align: right; font-size: 11px; color: #64748b; }
        .status { border: 1px solid #fdba74; background: #fff7ed; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
        .status .title { font-size: 14px; font-weight: 800; color: #ea580c; margin: 0 0 4px; }
        .status .sub { font-size: 11px; color: #475569; margin: 0; }
        .dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 7px; background: #fb923c; }
        .two-col { display: table; width: 100%; border-spacing: 8px; margin-bottom: 10px; }
        .two-col .col { display: table-cell; width: 50%; vertical-align: top; }
        .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        .label { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px; }
        .img-wrap { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: center; min-height: 250px; }
        .img-wrap img { max-width: 100%; max-height: 250px; }
        .reco { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e40af; border-radius: 8px; padding: 10px; line-height: 1.6; font-size: 12px; min-height: 230px; }
        .signs { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin-bottom: 10px; }
        .grid2 { display: table; width: 100%; }
        .grid2 .row { display: table-row; }
        .grid2 .cell { display: table-cell; width: 50%; vertical-align: top; padding: 3px 4px; }
        .s-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 7px; }
        .hall { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        .cover-foot {
            margin-top: 14px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            background: #ffffff;
            padding: 12px;
        }
        .cover-foot-title {
            font-size: 12px;
            font-weight: 800;
            color: #1e3a5f;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0 0 8px;
        }
        .cover-foot-text {
            font-size: 11px;
            color: #52627d;
            line-height: 1.6;
            margin: 0 0 6px;
        }
        ul { margin: 0; padding-left: 16px; }
        li { margin-bottom: 5px; line-height: 1.5; }
    </style>
</head>
<body>
    @php
        $signoLabels = [
            'microaneurismas' => 'Microaneurismas',
            'hemorragias' => 'Hemorragias retinianas',
            'exudados_duros' => 'Exudados duros',
            'exudados_blandos' => 'Exudados blandos (algodón)',
            'neovascularizacion' => 'Neovascularización',
            'edema_macular' => 'Edema macular',
        ];
        $primerRegistro = $registros->first();
    @endphp

    <div class="cover">
        <div class="brand-wrap">
            <div class="cell" style="width: 62px;">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="24" fill="#1f3b63"/>
                    <circle cx="26" cy="28" r="10" fill="#ffffff"/>
                    <circle cx="26" cy="28" r="5.5" fill="#2b6cb0"/>
                    <circle cx="28" cy="26" r="1.8" fill="#ffffff"/>
                    <path d="M10 20 Q15 10 26 10 Q37 10 42 20" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                    <path d="M10 20 Q14 8 17 18" stroke="#dc2626" stroke-width="3.2" fill="none" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="cell">
                <p class="brand">Multi Ópticas</p>
                <p class="brand-sub">Acceso Profesional</p>
            </div>
        </div>

        <div class="cover-card">
            <p class="cover-title">Historial completo de análisis de retina</p>
            <p class="cover-sub">
                Documento clínico consolidado con resultados de evaluaciones visuales.
                Incluye clasificación, imagen, recomendación, signos detectados y hallazgos por cada análisis.
            </p>
        </div>

        <table class="meta">
            <tr>
                <th class="h" scope="row">Paciente</th>
                <td>{{ trim(($paciente->nombre ?? '') . ' ' . ($paciente->apellido ?? '')) ?: 'No registrado' }}</td>
                <th class="h" scope="row">DNI</th>
                <td>{{ $paciente->dni ?? 'No registrado' }}</td>
            </tr>
            <tr>
                <th class="h" scope="row">Análisis registrados</th>
                <td>{{ $registros->count() }}</td>
                <th class="h" scope="row">Generado</th>
                <td>{{ $generadoEn->format('d/m/Y H:i') }}</td>
            </tr>
        </table>

        <div class="cover-foot">
            <p class="cover-foot-title">Resumen del documento</p>
            <p class="cover-foot-text">
                Este historial integra los resultados completos de las evaluaciones retinianas del paciente,
                ordenadas cronológicamente para facilitar seguimiento clínico y toma de decisiones.
            </p>
            <p class="cover-foot-text">
                Último análisis registrado:
                <strong>
                    {{ $primerRegistro ? ($primerRegistro->fecha_analisis ? \Carbon\Carbon::parse($primerRegistro->fecha_analisis)->format('d/m/Y H:i') : ($primerRegistro->created_at ? $primerRegistro->created_at->format('d/m/Y H:i') : 'No disponible')) : 'No disponible' }}
                </strong>
                · Emitido por Multi Ópticas.
            </p>
            <p class="cover-foot-text" style="margin-bottom: 0;">
                A continuación se presentan los resultados detallados, uno por página.
            </p>
        </div>
    </div>

    @foreach($registros as $registro)
        @php
            $imagen = $registro->imagen;
            $usuario = $registro->evaluacion?->usuario;
            $ruta = $imagen?->ruta_imagen ? storage_path('app/public/' . $imagen->ruta_imagen) : null;
            $imagenBase64 = null;
            if ($ruta && file_exists($ruta)) {
                $mime = $imagen?->mime_type ?: 'image/jpeg';
                $imagenBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($ruta));
            } elseif (!empty($imagen?->imagen_base64)) {
                $mime = $imagen?->mime_type ?: 'image/jpeg';
                $imagenBase64 = 'data:' . $mime . ';base64,' . $imagen->imagen_base64;
            }
            $hallazgos = is_array($imagen?->hallazgos) ? $imagen->hallazgos : (json_decode($imagen?->hallazgos ?? '[]', true) ?: []);
            $signosRd = is_array($imagen?->signos_rd) ? $imagen->signos_rd : (json_decode($imagen?->signos_rd ?? '[]', true) ?: []);
            $clasificacion = $registro->clasificacion ?? $imagen?->clasificacion ?? 'Sin clasificación';
        @endphp

        <div class="{{ $loop->first ? '' : 'page-break' }}">
            <div class="top-row">
                <div class="col" style="width: 70%;">
                    <div class="brand-block">
                        <div class="cell">
                            <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
                                <circle cx="26" cy="26" r="24" fill="#1f3b63"/>
                                <circle cx="26" cy="28" r="10" fill="#ffffff"/>
                                <circle cx="26" cy="28" r="5.5" fill="#2b6cb0"/>
                                <circle cx="28" cy="26" r="1.8" fill="#ffffff"/>
                                <path d="M10 20 Q15 10 26 10 Q37 10 42 20" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                                <path d="M10 20 Q14 8 17 18" stroke="#dc2626" stroke-width="3.2" fill="none" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="cell">
                            <div style="font-size: 22px; font-weight: 800; color: #1e3a5f;">Multi Ópticas</div>
                            <div style="font-size: 10px; color: #8aa0bf; letter-spacing: 2px; text-transform: uppercase;">Acceso Profesional</div>
                        </div>
                    </div>
                </div>
                <div class="col meta-right">
                    Análisis #{{ $loop->iteration }} de {{ $registros->count() }}<br>
                    Fecha: {{ $registro->fecha_analisis ? \Carbon\Carbon::parse($registro->fecha_analisis)->format('d/m/Y H:i') : ($registro->created_at ? $registro->created_at->format('d/m/Y H:i') : 'No disponible') }}
                </div>
            </div>

            <table class="meta" style="margin-top: 0; margin-bottom: 12px;">
                <tr>
                    <th class="h" scope="row">Paciente</th>
                    <td>{{ trim(($paciente->nombre ?? '') . ' ' . ($paciente->apellido ?? '')) ?: 'No registrado' }}</td>
                    <th class="h" scope="row">DNI</th>
                    <td>{{ $paciente->dni ?? 'No registrado' }}</td>
                </tr>
                <tr>
                    <th class="h" scope="row">Profesional</th>
                    <td>{{ trim(($usuario->nombre ?? '') . ' ' . ($usuario->apellido ?? '')) ?: 'No registrado' }}</td>
                    <th class="h" scope="row">Confianza/Urgencia</th>
                    <td>{{ $registro->nivel_confianza ?? $imagen?->nivel_confianza ?? 'No disponible' }} · {{ $registro->urgencia ?? $imagen?->urgencia ?? 'No disponible' }}</td>
                </tr>
            </table>

            <div class="status">
                <p class="title"><span class="dot"></span>{{ $clasificacion }}</p>
                <p class="sub">Confianza: <strong>{{ $registro->nivel_confianza ?? $imagen?->nivel_confianza ?? 'No disponible' }}</strong> · Urgencia: <strong>{{ $registro->urgencia ?? $imagen?->urgencia ?? 'No disponible' }}</strong></p>
            </div>

            <div class="two-col">
                <div class="col card">
                    <p class="label">Imagen guardada</p>
                    <div class="img-wrap">
                        @if($imagenBase64)
                            <img src="{{ $imagenBase64 }}" alt="Retinografía {{ $registro->id }}">
                        @else
                            <p>No se encontró imagen asociada.</p>
                        @endif
                    </div>
                </div>
                <div class="col card">
                    <p class="label">Recomendación</p>
                    <div class="reco">
                        {{ $imagen?->recomendacion ?? 'No disponible' }}
                    </div>
                </div>
            </div>

            @if(!empty($signosRd))
                <div class="signs">
                    <p class="label">Signos detectados</p>
                    <div class="grid2">
                        @php $i = 0; @endphp
                        @foreach($signoLabels as $key => $text)
                            @if($i % 2 === 0)<div class="row">@endif
                            <div class="cell">
                                @php $presente = (bool)($signosRd[$key] ?? false); @endphp
                                <span class="s-dot" style="background: {{ $presente ? '#ef4444' : '#22c55e' }};"></span>
                                <span style="color: {{ $presente ? '#1e293b' : '#94a3b8' }}; font-weight: {{ $presente ? '700' : '500' }};">{{ $text }}</span>
                            </div>
                            @php $i++; @endphp
                            @if($i % 2 === 0)</div>@endif
                        @endforeach
                        @if($i % 2 !== 0)</div>@endif
                    </div>
                </div>
            @endif

            @if(!empty($hallazgos))
                <div class="hall">
                    <p class="label">Hallazgos observados</p>
                    <ul>
                        @foreach($hallazgos as $hallazgo)
                            <li>{{ $hallazgo }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>
    @endforeach
</body>
</html>
