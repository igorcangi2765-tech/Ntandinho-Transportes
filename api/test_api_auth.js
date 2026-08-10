const express = require('express');
const http = require('http');

async function testApiEndpoint() {
  console.log('🧪 Iniciando testes de integridade dos endpoints da API...');

  // Importar servidor compilado dist/server.js
  require('./dist/server.js');

  // Aguardar 1.5 segundos para garantir inicialização do servidor HTTP
  await new Promise((resolve) => setTimeout(resolve, 1500));

  function makeRequest(path, method, body) {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : '';
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: 5000,
          path: path,
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              contentType: res.headers['content-type'],
              body: data,
            });
          });
        }
      );

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  try {
    // TESTE 1: Login Válido
    console.log('\n--- TESTE 1: POST /api/admin/auth/login (Credenciais Válidas) ---');
    const res1 = await makeRequest('/api/admin/auth/login', 'POST', {
      email: 'admin@ntandinho.co.mz',
      password: 'Admin2026!',
    });
    console.log('Status HTTP:', res1.statusCode);
    console.log('Content-Type:', res1.contentType);
    console.log('Resposta Body:', res1.body);

    const isJson1 = res1.contentType && res1.contentType.includes('application/json');
    const isSuccess1 = res1.statusCode === 200 && isJson1;
    console.log('✅ TESTE 1 RESULTADO:', isSuccess1 ? 'PASSOU (200 + JSON)' : 'FALHOU');

    // TESTE 2: Login Inválido
    console.log('\n--- TESTE 2: POST /api/admin/auth/login (Credenciais Inválidas) ---');
    const res2 = await makeRequest('/api/admin/auth/login', 'POST', {
      email: 'admin@ntandinho.co.mz',
      password: 'SenhaErrada123!',
    });
    console.log('Status HTTP:', res2.statusCode);
    console.log('Content-Type:', res2.contentType);
    console.log('Resposta Body:', res2.body);

    const isJson2 = res2.contentType && res2.contentType.includes('application/json');
    const isSuccess2 = res2.statusCode === 401 && isJson2;
    console.log('✅ TESTE 2 RESULTADO:', isSuccess2 ? 'PASSOU (401 + JSON)' : 'FALHOU');

    // TESTE 3: Rota Inexistente na API (/api/rota-inexistente)
    console.log('\n--- TESTE 3: GET /api/rota-inexistente (Verificar Fallback JSON 404) ---');
    const res3 = await makeRequest('/api/rota-inexistente', 'GET');
    console.log('Status HTTP:', res3.statusCode);
    console.log('Content-Type:', res3.contentType);
    console.log('Resposta Body:', res3.body);

    const isJson3 = res3.contentType && res3.contentType.includes('application/json');
    const isSuccess3 = res3.statusCode === 404 && isJson3 && !res3.body.includes('<!DOCTYPE html>');
    console.log('✅ TESTE 3 RESULTADO:', isSuccess3 ? 'PASSOU (404 + JSON, NUNCA HTML)' : 'FALHOU');

    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');
    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO DURANTE OS TESTES:', err);
    process.exit(1);
  }
}

testApiEndpoint();
