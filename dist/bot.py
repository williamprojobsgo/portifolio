import tkinter as tk
from tkinter import messagebox
import pyautogui
import time
import os
import shutil
import threading
from datetime import datetime
import pygetwindow as gw

# Lista de vendedores
vendedores = ["Lidiane", "Ivanildo", "Edvania", "Rogerio", "Adonias", "Anderson", "Romario"]

# Coordenadas da interface
campo_vencimento_de = (981, 246)
campo_vencimento_ate = (1162, 243)
campo_competencia_de = (558, 376)
campo_competencia_ate = (779, 364)
campo_status = (579, 586)
campo_vendedor = (814, 445)
botao_gerar = (683, 693)
ponto_fora = (700, 400)

# Caminho padrão de download
pasta_download = os.path.expanduser("~/Downloads")

# Controle de execução
pausado = False
parar = False
vencimento_ate_input = None

def fechar_janela_adobe():
    print("⏳ Aguardando abertura da janela do Adobe...")
    tempo_limite = time.time() + 15
    janela_adobe = None
    while time.time() < tempo_limite:
        janelas = gw.getWindowsWithTitle("Adobe")
        if janelas:
            janela_adobe = janelas[0]
            try:
                if not janela_adobe.isActive:
                    janela_adobe.activate()
                    time.sleep(1)
                janela_adobe.close()
                print("✅ Janela do Adobe fechada com sucesso.")
                return
            except Exception as e:
                print(f"⚠️ Erro ao tentar fechar: {e}")
        time.sleep(1)
    print("⚠️ Não foi possível encontrar ou fechar a janela do Adobe.")

def executar_automacao():
    global pausado, parar
    parar = False
    pausado = False

    vencimento_ate = vencimento_ate_input.get().strip()
    try:
        datetime.strptime(vencimento_ate, "%d/%m/%Y")
    except ValueError:
        messagebox.showerror("Erro", "Data inválida. Use o formato dd/mm/aaaa.")
        return

    btn_iniciar.config(state="disabled")
    messagebox.showinfo("Início", "Você tem 5 segundos para posicionar a tela.")
    time.sleep(5)

    data_pasta = vencimento_ate.replace("/", "-")
    pasta_destino = os.path.join(pasta_download, f"Relatorios_{data_pasta}")
    os.makedirs(pasta_destino, exist_ok=True)

    pyautogui.click(*campo_vencimento_de, clicks=3)
    pyautogui.write("01/01/2017")
    time.sleep(0.3)

    pyautogui.click(*campo_vencimento_ate, clicks=3)
    pyautogui.write(vencimento_ate)
    time.sleep(0.3)

    pyautogui.click(*campo_competencia_de, clicks=3)
    pyautogui.write("01/01/2017")
    time.sleep(0.3)

    pyautogui.click(*campo_competencia_ate, clicks=3)
    pyautogui.write(vencimento_ate)
    pyautogui.press("escape")
    time.sleep(0.3)

    pyautogui.click(*campo_status)
    time.sleep(0.3)
    pyautogui.write("Em aberto")
    pyautogui.press("enter")
    time.sleep(0.5)

    total = len(vendedores)
    for i, vendedor in enumerate(vendedores):
        if parar:
            status_label.config(text="❌ Automação resetada.")
            break

        while pausado:
            status_label.config(text="⏸️ Automação pausada...")
            time.sleep(0.5)
            if parar:
                status_label.config(text="❌ Automação resetada.")
                return

        status_label.config(text=f"🔄 Processando: {vendedor} ({i+1}/{total})")
        janela.update()

        pyautogui.click(*campo_vendedor)
        time.sleep(0.2)
        pyautogui.hotkey("ctrl", "a")
        pyautogui.press("backspace")
        pyautogui.write(vendedor)
        pyautogui.press("enter")
        time.sleep(0.3)

        pyautogui.click(*ponto_fora)
        time.sleep(0.3)
        pyautogui.click(*botao_gerar)

        fechar_janela_adobe()

        arquivo_pdf = None
        tentativas = 0
        while tentativas < 30:
            arquivos = [f for f in os.listdir(pasta_download) if f.lower().endswith(".pdf")]
            if arquivos:
                arquivos.sort(key=lambda f: os.path.getmtime(os.path.join(pasta_download, f)), reverse=True)
                arquivo_pdf = arquivos[0]
                caminho_origem = os.path.join(pasta_download, arquivo_pdf)
                if time.time() - os.path.getmtime(caminho_origem) < 30:
                    break
            time.sleep(1)
            tentativas += 1

        if arquivo_pdf:
            caminho_destino = os.path.join(pasta_destino, f"Relatorio_{vendedor}.pdf")
            try:
                shutil.move(caminho_origem, caminho_destino)
                print(f"✅ Relatório salvo: {caminho_destino}")
            except Exception as e:
                print(f"❌ Erro ao mover o arquivo: {e}")
        else:
            print(f"❌ Nenhum PDF recente encontrado para {vendedor}.")
        time.sleep(0.5)

    if not parar:
        status_label.config(text="✅ Todos os relatórios foram processados.")
        messagebox.showinfo("Concluído", f"Relatórios salvos em:\\n{pasta_destino}")
    btn_iniciar.config(state="normal")

def iniciar_thread():
    threading.Thread(target=executar_automacao).start()

def pausar():
    global pausado
    pausado = True

def continuar():
    global pausado
    pausado = False

def resetar():
    global parar, pausado
    parar = True
    pausado = False
    status_label.config(text="🔄 Resetando automação...")
    btn_iniciar.config(state="normal")

janela = tk.Tk()
janela.title("Automação de Relatórios PDF")
janela.geometry("450x380")

tk.Label(janela, text="📄 Automação de Relatórios PDF", font=("Arial", 14)).pack(pady=10)

frame_data = tk.Frame(janela)
frame_data.pack()
tk.Label(frame_data, text="Vencimento até (dd/mm/aaaa):", font=("Arial", 10)).pack(side="left", padx=5)
vencimento_ate_input = tk.Entry(frame_data, font=("Arial", 11), width=12)
vencimento_ate_input.pack(side="left", padx=5)

btn_iniciar = tk.Button(janela, text="▶ Iniciar Automação", bg="#4CAF50", fg="white", font=("Arial", 12), command=iniciar_thread)
btn_iniciar.pack(pady=8)

tk.Button(janela, text="⏸️ Pausar", bg="#f0ad4e", fg="white", font=("Arial", 12), command=pausar).pack(pady=5)
tk.Button(janela, text="▶ Continuar", bg="#0275d8", fg="white", font=("Arial", 12), command=continuar).pack(pady=5)
tk.Button(janela, text="🔄 Resetar", bg="#d9534f", fg="white", font=("Arial", 12), command=resetar).pack(pady=5)

status_label = tk.Label(janela, text="", font=("Arial", 10))
status_label.pack(pady=10)

janela.mainloop()


