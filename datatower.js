const datatower = class DataTower {
  constructor(){
    this.streams = []
  }

  listStreams(){
    return this.streams
  }
  debug(faucet){
    this.debugger = faucet
  }
  addStream(streamName){
    let streamExists = false
    this.streams.forEach(function(stream){
      if(stream.name == streamName){
        streamExists = true
      }
    })
    if(streamExists){
      throw `Stream '${streamName}' already exists`
    }else{
      this.streams.push({
        name: streamName,
        faucets: [],
      })
    }
  }
  delStream(streamName){
    this.streams.forEach(function(stream, streamPos){
      if(stream.name == streamName){
        this.streams.splice(streamPos-1, 1)
      }
    })
  }
  bind(streamName, faucet){
    let args = Array.prototype.slice.call(arguments)
    let streamExists = false
    this.streams.forEach(function(stream){
      if(stream.name == streamName){
        streamExists = true
        stream.faucets.push(faucet)
      }
    })
    if(!streamExists){
      this.addStream(streamName)
      this.bind.apply(this, args)
    }
  }
  unbind(streamName, faucet){
    this.streams.forEach(function(stream, streamPos){
      if(stream.name == stream){
        stream.faucets.forEach(function(currentFaucet, faucetPos){
          if(currentFaucet == faucet){
            stream.faucets.splice(faucetPos-1, 1)
          }
        })
      }
    })
  }
  sendTo(streamName){
    let args = Array.prototype.slice.call(arguments)
    let streamExists = false
    let db = this.debugger
    this.streams.forEach(function(stream){
      if(stream.name == streamName){
        streamExists = true
        args.shift()
        if(db != undefined){
          args.unshift(stream.name)
          db.apply(this, args)
        }
        stream.faucets.forEach(function(faucet){
          faucet.apply(this, args)
        })
      }
    })
    if(!streamExists){
      this.addStream(streamName)
      this.sendTo.apply(this, args)
    }
  }
}

window.DataTower = datatower