import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s = open('living-lab-v5.html').read()
s = s.replace("drone.rotation.order = 'YXZ';", "drone.rotation.order = 'YXZ'; window.__drone = drone; window.__scene = scene;")
s = s.replace("const car = { off: 0,", "const car = window.__car = { off: 0,")
s = s.replace("const LAYS = {};", "const LAYS = window.__lays = {};")
s = s.replace("function project(v) {", "window.__project = (v) => project(v); function project(v) {")
open('test-v5.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>\n' + s + '</body></html>')
