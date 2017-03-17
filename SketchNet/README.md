# How to Setup Your GPU instance for Training 

1. Create a Cybera RAC Account [here](https://rac-portal.cybera.ca)
2. Create a GPU instance following the instructions listed [here](https://docs.google.com/document/d/12_iH7oFfP2MTBi7wCR92PiIalhsB8i2bcz2G89wUsmk/edit#heading=h.uvc95u5xadk8)
3. ssh into your instance with 

        ssh -i cloud.key ubuntu@<floating IP>
        
4. Run the setup script

        bash env/setup.sh 
       
5. The script completes by rebooting up your instance. After a minute, ssh back onto your instance and you should be able to train models via GPU
