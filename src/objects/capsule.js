class Capsule extends Body{
    constructor(x1, y1, x2, y2, r, m = 0, g = false){
        super();
        this.comp = [new Circle(x1, y1, r), new Circle(x2, y2, r)];
        let recV1 = this.comp[1].pos.add(this.comp[1].pos.subtr(this.comp[0].pos).unit().normal().mult(r));
        let recV2 = this.comp[0].pos.add(this.comp[1].pos.subtr(this.comp[0].pos).unit().normal().mult(r));
        this.comp.unshift(new Rectangle(recV1.x, recV1.y, recV2.x, recV2.y, 2*r));
        this.pos = this.comp[0].pos;
        this.m = m;
        if (this.m === 0){
            this.inv_m = 0;
        } else {
            this.inv_m = 1 / this.m;
        }
        this.inertia = this.m * ((2*this.comp[0].width)**2 +(this.comp[0].length+2*this.comp[0].width)**2) / 12;
        if (this.m === 0){
            this.inv_inertia = 0;
        } else {
            this.inv_inertia = 1 / this.inertia;
        }
        if (g) {
        this.gravity = Math.sqrt(((Math.PI*r**2)+((x2-x1)*(y2-y1)))/this.m);
        }
    }

    keyControl(){
        if(this.keyMap.get('W')){
            this.acc = this.comp[0].dir.mult(-this.keyForce);
        }
        if(this.keyMap.get('S')){
            this.acc = this.comp[0].dir.mult(this.keyForce);
        }
        if(this.keyMap.get('A')){
            this.angVel = -this.angKeyForce;
        }
        if(this.keyMap.get('D')){
            this.angVel = this.angKeyForce;
        }
        if(!this.keyMap.get('W') && !this.keyMap.get('S')){
            this.acc.set(0, 0);
        }
        super.keyControl();
    }

    setPosition(x, y, a = this.angle){
        this.pos.set(x, y);
        this.angle = a;
        this.comp[0].pos = this.pos;
        this.comp[0].getVertices(this.angle + this.angVel);
        this.comp[1].pos = this.comp[0].pos.add(this.comp[0].dir.mult(-this.comp[0].length/2));
        this.comp[2].pos = this.comp[0].pos.add(this.comp[0].dir.mult(this.comp[0].length/2));
        this.angle += this.angVel;
    }

    reposition(){
        super.reposition();
        this.setPosition(this.pos.add(this.vel).x, this.pos.add(this.vel).y);
    }
}