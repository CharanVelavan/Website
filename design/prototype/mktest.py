s = open('living-lab-3d.html').read()
s = s.replace("drone.rotation.order = 'YXZ';", "drone.rotation.order = 'YXZ'; window.__drone = drone;")
open('test.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>\n' + s + '</body></html>')
