<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe de Retinografia</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #1f2937; font-size: 12px; margin: 22px; }
        .top { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        .top td { vertical-align: middle; }
        .brand { font-size: 28px; font-weight: 800; color: #1e3a5f; letter-spacing: 0.5px; }
        .brand-sub { font-size: 10px; color: #8aa0bf; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
        .meta { text-align: right; font-size: 11px; color: #64748b; }
        .patient { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        .patient td { border: 1px solid #e2e8f0; padding: 6px 8px; }
        .patient .h { background: #f8fafc; color: #475569; font-weight: 700; width: 22%; }
        .status { border: 1px solid #fdba74; background: #fff7ed; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
        .status .title { font-size: 14px; font-weight: 800; color: #ea580c; margin: 0 0 4px; }
        .status .sub { font-size: 11px; color: #475569; margin: 0; }
        .dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 7px; background: #fb923c; }
        .two-col { width: 100%; border-collapse: separate; border-spacing: 8px; margin-bottom: 10px; }
        .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        .label { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px; }
        .img-wrap { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: center; min-height: 250px; }
        .img-wrap img { max-width: 100%; max-height: 250px; }
        .reco { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e40af; border-radius: 8px; padding: 10px; line-height: 1.6; font-size: 12px; min-height: 230px; }
        .signs { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin-bottom: 10px; }
        .grid2 { width: 100%; border-collapse: collapse; }
        .grid2 td { width: 50%; vertical-align: top; padding: 3px 4px; }
        .s-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 7px; }
        .hall { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        ul { margin: 0; padding-left: 16px; }
        li { margin-bottom: 5px; line-height: 1.5; }
    </style>
</head>
<body>
@php
    $paciente = $registro->paciente;
    $evaluacion = $registro->evaluacion;
    $usuario = $evaluacion?->usuario;
    $imagen = $registro->imagen;
    $hallazgos = is_array($imagen?->hallazgos) ? $imagen->hallazgos : (json_decode($imagen?->hallazgos ?? '[]', true) ?: []);
    $signosRd = is_array($imagen?->signos_rd) ? $imagen->signos_rd : (json_decode($imagen?->signos_rd ?? '[]', true) ?: []);
    $imagenBase64 = null;
    if ($imagenUrl && file_exists($imagenUrl)) {
        $mime = $imagen?->mime_type ?: 'image/jpeg';
        $imagenBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($imagenUrl));
    } elseif (!empty($imagenDataUri)) {
        $imagenBase64 = $imagenDataUri;
    }

    $logoSvg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
  <circle cx="26" cy="26" r="24" fill="#1f3b63"/>
  <circle cx="26" cy="28" r="10" fill="#ffffff"/>
  <circle cx="26" cy="28" r="5.5" fill="#2b6cb0"/>
  <circle cx="28" cy="26" r="1.8" fill="#ffffff"/>
  <path d="M10 20 Q15 10 26 10 Q37 10 42 20" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M10 20 Q14 8 17 18" stroke="#dc2626" stroke-width="3.2" fill="none" stroke-linecap="round"/>
</svg>
SVG;
    $logoDataUri = 'data:image/svg+xml;base64,' . base64_encode($logoSvg);

    $signoLabels = [
      'microaneurismas' => 'Microaneurismas',
      'hemorragias' => 'Hemorragias retinianas',
      'exudados_duros' => 'Exudados duros',
      'exudados_blandos' => 'Exudados blandos (algodón)',
      'neovascularizacion' => 'Neovascularización',
      'edema_macular' => 'Edema macular',
    ];
    $clasificacion = $registro->clasificacion ?? $imagen?->clasificacion ?? 'Sin clasificación';
@endphp

<table class="top">
    <tr>
        <td style="width: 70%;">
            <table style="border-collapse: collapse;">
                <tr>
                    <td style="padding-right: 12px;">
                        <img src="{{ $logoDataUri }}" alt="Logo Multi Ópticas" style="width:46px;height:46px;display:block;">
                    </td>
                    <td>
                        <div class="brand">Multi Ópticas</div>
                        <div class="brand-sub">Acceso Profesional</div>
                    </td>
                </tr>
            </table>
        </td>
        <td class="meta">
            Informe de análisis<br>
            Generado: {{ $generadoEn->format('d/m/Y H:i') }}
        </td>
    </tr>
</table>

<table class="patient">
    <tr>
        <td class="h">Paciente</td>
        <td>{{ trim(($paciente->nombre ?? '') . ' ' . ($paciente->apellido ?? '')) ?: 'No registrado' }}</td>
        <td class="h">DNI</td>
        <td>{{ $paciente->dni ?? 'No registrado' }}</td>
    </tr>
    <tr>
        <td class="h">Fecha análisis</td>
        <td>{{ $registro->fecha_analisis ? \Carbon\Carbon::parse($registro->fecha_analisis)->format('d/m/Y H:i') : ($registro->created_at ? $registro->created_at->format('d/m/Y H:i') : 'No disponible') }}</td>
        <td class="h">Profesional</td>
        <td>{{ trim(($usuario->nombre ?? '') . ' ' . ($usuario->apellido ?? '')) ?: 'No registrado' }}</td>
    </tr>
</table>

<div class="status">
    <p class="title"><span class="dot"></span>{{ $clasificacion }}</p>
    <p class="sub">Confianza: <strong>{{ $registro->nivel_confianza ?? $imagen?->nivel_confianza ?? 'No disponible' }}</strong> · Urgencia: <strong>{{ $registro->urgencia ?? $imagen?->urgencia ?? 'No disponible' }}</strong></p>
</div>

<table class="two-col">
    <tr>
        <td class="card" style="width:50%;">
            <p class="label">Imagen guardada</p>
            <div class="img-wrap">
                @if($imagenBase64)
                    <img src="{{ $imagenBase64 }}" alt="Imagen de retinografia">
                @else
                    <p>No se encontró imagen asociada.</p>
                @endif
            </div>
        </td>
        <td class="card" style="width:50%;">
            <p class="label">Recomendación</p>
            <div class="reco">
                {{ $imagen?->recomendacion ?? 'No disponible' }}
            </div>
        </td>
    </tr>
</table>

@if(!empty($signosRd))
    <div class="signs">
        <p class="label">Signos detectados</p>
        <table class="grid2">
            @php $i = 0; @endphp
            @foreach($signoLabels as $key => $text)
                @if($i % 2 === 0)<tr>@endif
                <td>
                    @php $presente = (bool)($signosRd[$key] ?? false); @endphp
                    <span class="s-dot" style="background: {{ $presente ? '#ef4444' : '#22c55e' }};"></span>
                    <span style="color: {{ $presente ? '#1e293b' : '#94a3b8' }}; font-weight: {{ $presente ? '700' : '500' }};">{{ $text }}</span>
                </td>
                @php $i++; @endphp
                @if($i % 2 === 0)</tr>@endif
            @endforeach
            @if($i % 2 !== 0)</tr>@endif
        </table>
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

</body>
</html>
