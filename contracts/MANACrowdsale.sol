contract TheSimplestCrowdsale {
    address owner;
    TheSimplestToken  public token = new TheSimplestToken();
    uint start = 1516713344;
    uint period = 20;

    function TheSimplestCrowdsale() {
        owner = msg.sender;
    }

    function() external payable {
        require(now > start && now < start + period*24*60*60);
        owner.transfer(msg.value);
        token.mint(msg.sender, msg.value);
    }
}
