import os

package_name = 'dxinefSassBuilder'

def plugin_loaded():
  from package_control import events
  if events.install(package_name):
    path = os.getcwd() + '/' + package_name
    os.chdir(path)
    os.system('npm i')