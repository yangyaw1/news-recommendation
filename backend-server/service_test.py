import jsonrpclib
import service
import time

from multiprocessing import Process

def test():
    service_process = Process(target=service.start)
    service_process.start()
    
    time.sleep(1)
    
    server = jsonrpclib.ServerProxy('http://localhost:4040')
    assert server.add(5,6) == 11
    print('test passed!')
    
    service_process.terminate()
    
if __name__ == "__main__":
    test()
    