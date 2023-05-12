module.exports = (srv) => {

    srv.on("DeleteResult",async (req) => {
      console.log("[INFO] Deleting result of last command")
      await DELETE.from`endpoint_model.CommandResult`
    });
  
  }
  