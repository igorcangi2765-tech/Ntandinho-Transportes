<?php
declare(strict_types=1);

/**
 * Gestor de Conexão à Base de Dados MySQL via PDO Singleton
 * ERP N'Tandinho Transportes S.A.
 */
class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
            $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'u178468876_u178468876_Dts';
            $user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'u178468876_u178468876_log';
            $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: 'Adm0001';

            // Tenta obter credenciais de ficheiro .env se existente
            $envPath = __DIR__ . '/../.env';
            if (file_exists($envPath)) {
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    if (strpos($line, '=') !== false) {
                        list($name, $val) = explode('=', $line, 2);
                        $name = trim($name);
                        $val = trim($val, " \t\n\r\0\x0B\"'");
                        if ($name === 'DATABASE_URL' && !empty($val)) {
                            // Parse mysql://user:pass@host:port/dbname
                            $parsed = parse_url($val);
                            if ($parsed && isset($parsed['host'])) {
                                $host = $parsed['host'];
                                $port = (string)($parsed['port'] ?? '3306');
                                $user = urldecode($parsed['user'] ?? $user);
                                $pass = urldecode($parsed['pass'] ?? $pass);
                                $dbname = ltrim($parsed['path'] ?? $dbname, '/');
                            }
                        } elseif ($name === 'DB_HOST' && !empty($val)) {
                            $host = $val;
                        } elseif ($name === 'DB_PORT' && !empty($val)) {
                            $port = $val;
                        } elseif ($name === 'DB_NAME' && !empty($val)) {
                            $dbname = $val;
                        } elseif ($name === 'DB_USER' && !empty($val)) {
                            $user = $val;
                        } elseif ($name === 'DB_PASS') {
                            $pass = $val;
                        }
                    }
                }
            }

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Não expor a palavra-passe em erros de ligação
                throw new PDOException("Falha na ligação à base de dados MySQL (Utilizador: '{$user}', BD: '{$dbname}', Host: '{$host}'): " . $e->getMessage(), (int)$e->getCode());
            }
        }

        return self::$instance;
    }
}
