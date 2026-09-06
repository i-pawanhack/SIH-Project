"""
RetinaXAI — Local Development Server
Smart India Hackathon (SIH26038)
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORTS = [8080, 8000, 3000, 8081, 5000, 8888]

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    
    httpd = None
    selected_port = None
    
    ServerClass = getattr(http.server, 'ThreadingHTTPServer', socketserver.ThreadingTCPServer)

    for port in PORTS:
        try:
            httpd = ServerClass(("", port), Handler)
            selected_port = port
            break
        except (OSError, PermissionError):
            continue
            
    if not httpd:
        # Fallback to ephemeral port
        httpd = ServerClass(("", 0), Handler)
        selected_port = httpd.server_address[1]

    with httpd:
        url = f"http://localhost:{selected_port}"
        print(f"================================================================")
        print(f"  RetinaXAI — Explainable AI Retinal Screening System")
        print(f"  Smart India Hackathon (SIH26038)")
        print(f"  Server running at: {url}")
        print(f"================================================================")
        
        try:
            webbrowser.open(url)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down RetinaXAI server.")
            sys.exit(0)

def main():
    start_server()

if __name__ == '__main__':
    main()
