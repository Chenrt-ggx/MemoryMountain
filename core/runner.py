import os
import subprocess
import webbrowser
from urllib import parse

name = 'run.exe'
baseUrl = 'http://127.0.0.1:8080'

if __name__ == '__main__':
    files = list(filter(lambda x: x.endswith('.c'), os.listdir()))
    cmd = ' '.join(['gcc'] + files + ['-o', name, '-O2'])
    print('--------------- compile ---------------\n' + cmd + '\n')
    os.system(cmd)
    print('--------------- execute ---------------\n' + name + '\n')
    runner = subprocess.Popen(name, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8")
    out, err = runner.communicate()
    print('--------------- stdout ---------------\n' + out)
    print('--------------- stderr ---------------\n' + err)
    url = baseUrl + '?map=' + parse.quote(out)
    print('--------------- request ---------------\n' + url)
    webbrowser.open(url)
    os.system('rm ./' + name)
