import os
import sys
import platform
import subprocess
import webbrowser
from urllib import parse

name = 'run.exe'
localUrl = 'http://127.0.0.1:8080'
remoteUrl = 'https://chenrt-ggx.github.io/MemoryMountain'

if __name__ == '__main__':
    files = list(filter(lambda x: x.endswith('.c'), os.listdir()))
    cmd = ' '.join(['gcc'] + files + ['-o', name, '-O2'])
    print('--------------- compile ---------------\n' + cmd + '\n')
    os.system(cmd)
    cmd = name if 'windows' in platform.platform().lower() else './' + name
    print('--------------- execute ---------------\n' + cmd + '\n')
    runner = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8")
    out, err = runner.communicate()
    print('--------------- stdout ---------------\n' + out)
    print('--------------- stderr ---------------\n' + err)
    baseUrl = localUrl if len(sys.argv) == 2 and sys.argv[1] == '-local' else remoteUrl
    url = baseUrl + '?map=' + parse.quote(out)
    print('--------------- request ---------------\n' + url)
    webbrowser.open(url)
    os.system('rm ./' + name)
